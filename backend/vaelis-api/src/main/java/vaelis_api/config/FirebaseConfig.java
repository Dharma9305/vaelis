package vaelis_api.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp firebaseApp() throws IOException {

        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        String credentialsPath =
                System.getenv("GOOGLE_APPLICATION_CREDENTIALS");

        if (credentialsPath == null ||
                credentialsPath.isBlank()) {

            throw new IllegalStateException(
                    "GOOGLE_APPLICATION_CREDENTIALS environment variable is not configured."
            );
        }

        try (FileInputStream serviceAccount =
                     new FileInputStream(credentialsPath)) {

            FirebaseOptions options =
                    FirebaseOptions.builder()
                            .setCredentials(
                                    GoogleCredentials
                                            .fromStream(serviceAccount)
                            )
                            .build();

            return FirebaseApp.initializeApp(
                    options
            );
        }
    }
}