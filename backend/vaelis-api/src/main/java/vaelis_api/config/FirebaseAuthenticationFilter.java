package vaelis_api.config;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class FirebaseAuthenticationFilter
        extends OncePerRequestFilter {

    private final FirebaseAuth firebaseAuth;

    public FirebaseAuthenticationFilter(
            FirebaseApp firebaseApp) {

        /*
         * FirebaseApp is already created by FirebaseConfig.
         *
         * No IOException is thrown here.
         */

        this.firebaseAuth =
                FirebaseAuth.getInstance(
                        firebaseApp
                );
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorization =
                request.getHeader(
                        HttpHeaders.AUTHORIZATION
                );

        /*
         * No Firebase Bearer token.
         *
         * Continue normally so existing ADMIN
         * Basic Authentication continues working.
         */

        if (authorization == null ||
                !authorization.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String token =
                authorization
                        .substring(7)
                        .trim();

        if (token.isBlank()) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        try {

            FirebaseToken decodedToken =
                    firebaseAuth.verifyIdToken(
                            token
                    );

            String uid =
                    decodedToken.getUid();

            String email =
                    decodedToken.getEmail();

            String phoneNumber = null;

            Object phoneClaim =
                    decodedToken
                            .getClaims()
                            .get("phone_number");

            if (phoneClaim != null) {

                phoneNumber =
                        String.valueOf(
                                phoneClaim
                        );
            }

            CustomerPrincipal principal =
                    new CustomerPrincipal(
                            uid,
                            email,
                            phoneNumber
                    );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            principal,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_CUSTOMER"
                                    )
                            )
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );

        } catch (FirebaseAuthException e) {

            SecurityContextHolder
                    .clearContext();

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType(
                    "application/json"
            );

            response.getWriter().write(
                    """
                    {"error":"Invalid or expired Firebase authentication token."}
                    """
            );

            return;

        } catch (RuntimeException e) {

            SecurityContextHolder
                    .clearContext();

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType(
                    "application/json"
            );

            response.getWriter().write(
                    """
                    {"error":"Customer authentication failed."}
                    """
            );

            return;
        }

        filterChain.doFilter(
                request,
                response
        );
    }

    // =========================================================
    // CUSTOMER PRINCIPAL
    // =========================================================

    public static class CustomerPrincipal {

        private final String uid;

        private final String email;

        private final String phoneNumber;

        public CustomerPrincipal(
                String uid,
                String email,
                String phoneNumber) {

            this.uid = uid;
            this.email = email;
            this.phoneNumber = phoneNumber;
        }

        public String getUid() {
            return uid;
        }

        public String getEmail() {
            return email;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }
    }
}