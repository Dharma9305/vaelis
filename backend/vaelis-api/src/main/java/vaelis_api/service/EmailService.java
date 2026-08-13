package vaelis_api.service;

import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import vaelis_api.entity.Order;
import vaelis_api.entity.OrderItem;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${vaelis.frontend.url}")
    private String frontendUrl;

    public EmailService(
            JavaMailSender mailSender) {

        this.mailSender = mailSender;
    }

    // =========================================================
    // ORDER STATUS EMAIL
    // =========================================================

    public void sendOrderStatusEmail(
            Order order) {

        if (order.getEmail() == null ||
                order.getEmail().isBlank()) {

            return;
        }

        try {

            MimeMessage mimeMessage =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            mimeMessage,
                            true,
                            "UTF-8"
                    );

            helper.setTo(
                    order.getEmail()
            );

            helper.setSubject(
                    "VAELIS Order #" +
                    order.getId() +
                    " - " +
                    order.getOrderStatus()
            );

            helper.setText(
                    buildHtmlEmail(
                            order,
                            false
                    ),
                    true
            );

            mailSender.send(
                    mimeMessage
            );

            System.out.println(
                    "HTML EMAIL SENT SUCCESSFULLY TO: "
                    + order.getEmail()
            );

        } catch (Exception e) {

            System.err.println(
                    "========== EMAIL ERROR =========="
            );

            e.printStackTrace();

            System.err.println(
                    "================================="
            );

            throw new RuntimeException(
                    "Unable to send order email",
                    e
            );
        }
    }

    // =========================================================
    // ORDER CONFIRMATION EMAIL
    // =========================================================

    public void sendOrderConfirmationEmail(
            Order order) {

        if (order.getEmail() == null ||
                order.getEmail().isBlank()) {

            return;
        }

        try {

            MimeMessage mimeMessage =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            mimeMessage,
                            true,
                            "UTF-8"
                    );

            helper.setTo(
                    order.getEmail()
            );

            helper.setSubject(
                    "VAELIS Order Confirmed - #"
                            + order.getId()
            );

            helper.setText(
                    buildHtmlEmail(
                            order,
                            true
                    ),
                    true
            );

            mailSender.send(
                    mimeMessage
            );

            System.out.println(
                    "ORDER CONFIRMATION EMAIL SENT SUCCESSFULLY TO: "
                    + order.getEmail()
            );

        } catch (Exception e) {

            System.err.println(
                    "========== ORDER CONFIRMATION EMAIL ERROR =========="
            );

            e.printStackTrace();

            throw new RuntimeException(
                    "Unable to send order confirmation email",
                    e
            );
        }
    }

    // =========================================================
    // SHIPMENT EMAIL
    // =========================================================

    public void sendShipmentEmail(
            Order order) {

        if (order.getEmail() == null ||
                order.getEmail().isBlank()) {

            return;
        }

        try {

            MimeMessage mimeMessage =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            mimeMessage,
                            true,
                            "UTF-8"
                    );

            helper.setTo(
                    order.getEmail()
            );

            helper.setSubject(
                    "VAELIS Order Shipped - #"
                            + order.getId()
            );

            String customerName =
        formatCustomerFirstName(
                order.getCustomerName()
        );

            String shippingPartner =
                    escapeHtml(
                            order.getShippingPartner()
                    );

            String trackingNumber =
                    escapeHtml(
                            order.getTrackingNumber()
                    );

            String trackingUrl =
                    order.getTrackingUrl();

            String expectedDelivery =
                    "To be confirmed";

            if (order.getExpectedDeliveryDate() != null) {

                expectedDelivery =
                        order.getExpectedDeliveryDate()
                                .format(
                                        DateTimeFormatter.ofPattern(
                                                "dd MMM yyyy"
                                        )
                                );
            }

            String trackingButton = "";

            if (trackingUrl != null &&
                    !trackingUrl.isBlank()) {

                trackingButton =
                        "<div style='margin-top:25px;text-align:center;'>"
                        +
                        "<a href='"
                        +
                        escapeHtml(trackingUrl)
                        +
                        "' style='"
                        + "display:inline-block;"
                        + "padding:14px 28px;"
                        + "background:#c9a227;"
                        + "color:#050505;"
                        + "text-decoration:none;"
                        + "border-radius:8px;"
                        + "font-size:12px;"
                        + "font-weight:700;"
                        + "letter-spacing:1px;"
                        + "'>"
                        +
                        "TRACK SHIPMENT"
                        +
                        "</a>"
                        +
                        "</div>";
            }

            String html =
                    """
                    <!DOCTYPE html>
                    <html>

                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport"
                              content="width=device-width, initial-scale=1.0">
                        <title>VAELIS Order Shipped</title>
                    </head>

                    <body style="
                        margin:0;
                        padding:0;
                        background:#050505;
                        font-family:Arial,Helvetica,sans-serif;
                        color:#ffffff;
                    ">

                    <table width="100%%"
                           cellpadding="0"
                           cellspacing="0"
                           border="0"
                           style="
                               background:#050505;
                               padding:30px 10px;
                           ">

                        <tr>
                            <td align="center">

                                <table width="100%%"
                                       cellpadding="0"
                                       cellspacing="0"
                                       border="0"
                                       style="
                                           max-width:680px;
                                           background:#101010;
                                           border:1px solid #262626;
                                           border-radius:18px;
                                           overflow:hidden;
                                       ">

                                    <!-- HEADER -->

                                    <tr>
                                        <td style="
                                            padding:30px 35px;
                                            text-align:center;
                                            border-bottom:1px solid #262626;
                                        ">

                                            <div style="
                                                font-size:28px;
                                                font-weight:700;
                                                letter-spacing:5px;
                                            ">
                                                VAELIS
                                            </div>

                                            <div style="
                                                margin-top:8px;
                                                font-size:11px;
                                                letter-spacing:3px;
                                                color:#c9a227;
                                            ">
                                                PREMIUM AUDIO
                                            </div>

                                        </td>
                                    </tr>

                                    <!-- MESSAGE -->

                                    <tr>
                                        <td style="
                                            padding:40px 35px;
                                            text-align:center;
                                        ">

                                            <div style="
                                                font-size:13px;
                                                color:#888888;
                                                letter-spacing:1px;
                                                text-transform:uppercase;
                                            ">
                                                Order #"""
                    + order.getId()
                    + """
                                            </div>

                                            <h1 style="
                                                margin:20px 0 10px;
                                                font-size:26px;
                                                color:#ffffff;
                                            ">
                                                Your order has been shipped
                                            </h1>

                                            <p style="
                                                margin:0;
                                                color:#999999;
                                                font-size:14px;
                                                line-height:1.7;
                                            ">
                                                Hello """
                    + customerName
                    + """
                                                , your VAELIS order is on its way.
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- SHIPMENT DETAILS -->

                                    <tr>
                                        <td style="
                                            padding:30px 35px;
                                            background:#0b0b0b;
                                            border-top:1px solid #262626;
                                            border-bottom:1px solid #262626;
                                        ">

                                            <div style="
                                                font-size:16px;
                                                font-weight:600;
                                                margin-bottom:20px;
                                            ">
                                                Shipment Details
                                            </div>

                                            <table width="100%%"
                                                   cellpadding="0"
                                                   cellspacing="0"
                                                   border="0">

                                                <tr>

                                                    <td width="50%%"
                                                        style="padding:10px 0;">

                                                        <div style="
                                                            font-size:11px;
                                                            color:#777777;
                                                            text-transform:uppercase;
                                                        ">
                                                            Shipping Partner
                                                        </div>

                                                        <div style="
                                                            margin-top:6px;
                                                            color:#ffffff;
                                                            font-size:14px;
                                                            font-weight:600;
                                                        ">
                    """
                    + shippingPartner
                    + """
                                                        </div>

                                                    </td>

                                                    <td width="50%%"
                                                        align="right"
                                                        style="padding:10px 0;">

                                                        <div style="
                                                            font-size:11px;
                                                            color:#777777;
                                                            text-transform:uppercase;
                                                        ">
                                                            Tracking Number
                                                        </div>

                                                        <div style="
                                                            margin-top:6px;
                                                            color:#ffffff;
                                                            font-size:14px;
                                                            font-weight:600;
                                                        ">
                    """
                    + trackingNumber
                    + """
                                                        </div>

                                                    </td>

                                                </tr>

                                                <tr>

                                                    <td colspan="2"
                                                        style="padding-top:20px;">

                                                        <div style="
                                                            font-size:11px;
                                                            color:#777777;
                                                            text-transform:uppercase;
                                                        ">
                                                            Expected Delivery
                                                        </div>

                                                        <div style="
                                                            margin-top:6px;
                                                            color:#c9a227;
                                                            font-size:15px;
                                                            font-weight:600;
                                                        ">
                    """
                    + expectedDelivery
                    + """
                                                        </div>

                                                    </td>

                                                </tr>

                                            </table>

                    """
                    + trackingButton
                    + """

                                        </td>
                                    </tr>

                                    <!-- FOOTER -->

                                    <tr>
                                        <td style="
                                            padding:30px 35px;
                                            text-align:center;
                                            background:#080808;
                                        ">

                                            <div style="
                                                font-size:22px;
                                                font-weight:700;
                                                letter-spacing:4px;
                                            ">
                                                VAELIS
                                            </div>

                                            <div style="
                                                margin-top:10px;
                                                font-size:11px;
                                                color:#777777;
                                            ">
                                                Designed for extraordinary sound.
                                            </div>

                                            <div style="
                                                margin-top:20px;
                                                font-size:11px;
                                                color:#555555;
                                            ">
                                                Thank you for choosing VAELIS.
                                            </div>

                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>

                    </table>

                    </body>
                    </html>
                    """;

            helper.setText(
                    html,
                    true
            );

            mailSender.send(
                    mimeMessage
            );

            System.out.println(
                    "SHIPMENT EMAIL SENT SUCCESSFULLY TO: "
                    + order.getEmail()
            );

        } catch (Exception e) {

            System.err.println(
                    "========== SHIPMENT EMAIL ERROR =========="
            );

            e.printStackTrace();

            throw new RuntimeException(
                    "Unable to send shipment email",
                    e
            );
        }
    }

    // =========================================================
    // BUILD ORDER EMAIL HTML
    // =========================================================

    private String buildHtmlEmail(
            Order order,
            boolean confirmationEmail) {

        StringBuilder itemsHtml =
                new StringBuilder();

        List<OrderItem> items =
                order.getItems();

        if (items != null) {

            for (OrderItem item : items) {

                itemsHtml.append(
                        "<tr>"
                );

                itemsHtml.append(
                        "<td style='padding:16px 0;border-bottom:1px solid #2a2a2a;'>"
                );

                itemsHtml.append(
                        "<div style='font-size:15px;font-weight:600;color:#ffffff;'>"
                );

                itemsHtml.append(
                        escapeHtml(
                                item.getProductName()
                        )
                );

                itemsHtml.append(
                        "</div>"
                );

                itemsHtml.append(
                        "<div style='margin-top:5px;font-size:12px;color:#999999;'>"
                );

                itemsHtml.append(
                        escapeHtml(
                                item.getColor()
                        )
                );

                itemsHtml.append(
                        "</div>"
                );

                itemsHtml.append(
                        "</td>"
                );

                itemsHtml.append(
                        "<td style='padding:16px 8px;border-bottom:1px solid #2a2a2a;text-align:center;color:#cccccc;'>"
                );

                itemsHtml.append(
                        item.getQuantity()
                );

                itemsHtml.append(
                        "</td>"
                );

                itemsHtml.append(
                        "<td style='padding:16px 0;border-bottom:1px solid #2a2a2a;text-align:right;color:#ffffff;font-weight:600;'>"
                );

                itemsHtml.append(
                        formatAmount(
                                item.getTotal()
                        )
                );

                itemsHtml.append(
                        "</td>"
                );

                itemsHtml.append(
                        "</tr>"
                );
            }
        }

        String statusColor =
                getStatusColor(
                        order.getOrderStatus()
                );

        String statusText =
                escapeHtml(
                        order.getOrderStatus()
                );

       String customerName =
        formatCustomerFirstName(
                order.getCustomerName()
        );

        String emailTitle =
                confirmationEmail
                        ? "Your order is confirmed"
                        : "Your order has been updated";

        String emailMessage =
                confirmationEmail
                        ? "Thank you for your order with VAELIS. Your payment has been successfully verified and your order is now confirmed."
                        : "Hello " + customerName
                            + ", your VAELIS order status has been updated successfully.";

        String address =
                escapeHtml(
                        order.getAddress()
                );

        String city =
                escapeHtml(
                        order.getCity()
                );

        String state =
                escapeHtml(
                        order.getState()
                );

        String pincode =
                escapeHtml(
                        order.getPincode()
                );

        String shipmentHtml =
                buildShipmentHtml(order);

        return """
                <!DOCTYPE html>
                <html>

                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0">
                    <title>VAELIS Order</title>
                </head>

                <body style="
                    margin:0;
                    padding:0;
                    background:#050505;
                    font-family:Arial,Helvetica,sans-serif;
                    color:#ffffff;
                ">

                <table width="100%%"
                       cellpadding="0"
                       cellspacing="0"
                       border="0"
                       style="background:#050505;padding:30px 10px;">

                    <tr>
                        <td align="center">

                            <table width="100%%"
                                   cellpadding="0"
                                   cellspacing="0"
                                   border="0"
                                   style="
                                       max-width:680px;
                                       background:#101010;
                                       border:1px solid #262626;
                                       border-radius:18px;
                                       overflow:hidden;
                                   ">

                                <!-- HEADER -->

                                <tr>
                                    <td style="
                                        padding:30px 35px;
                                        text-align:center;
                                        border-bottom:1px solid #262626;
                                    ">

                                        <div style="
                                            font-size:28px;
                                            font-weight:700;
                                            letter-spacing:5px;
                                            color:#ffffff;
                                        ">
                                            VAELIS
                                        </div>

                                        <div style="
                                            margin-top:8px;
                                            font-size:11px;
                                            letter-spacing:3px;
                                            color:#c9a227;
                                        ">
                                            PREMIUM AUDIO
                                        </div>

                                    </td>
                                </tr>

                                <!-- ORDER STATUS -->

                                <tr>
                                    <td style="
                                        padding:35px;
                                        text-align:center;
                                    ">

                                        <div style="
                                            font-size:13px;
                                            color:#888888;
                                            letter-spacing:1px;
                                            text-transform:uppercase;
                                        ">
                                            Order #"""
                + order.getId()
                + """
                                        </div>

                                        <div style="
                                            margin-top:18px;
                                            display:inline-block;
                                            padding:9px 18px;
                                            border-radius:30px;
                                            background:"""
                + statusColor
                + """
                                            ;
                                            color:#ffffff;
                                            font-size:12px;
                                            font-weight:bold;
                                            letter-spacing:1px;
                                        ">
                                            """
                + statusText
                + """
                                        </div>

                                        <h1 style="
                                            margin:22px 0 8px;
                                            font-size:24px;
                                            color:#ffffff;
                                        ">
                                            """
                + emailTitle
                + """
                                        </h1>

                                        <p style="
                                            margin:0;
                                            color:#999999;
                                            font-size:14px;
                                            line-height:1.7;
                                        ">
                                            """
                + emailMessage
                + """
                                        </p>

                                    </td>
                                </tr>

                                <!-- ITEMS -->

                                <tr>
                                    <td style="padding:0 35px 30px;">

                                        <div style="
                                            font-size:16px;
                                            font-weight:600;
                                            color:#ffffff;
                                            margin-bottom:15px;
                                        ">
                                            Order Summary
                                        </div>

                                        <table width="100%%"
                                               cellpadding="0"
                                               cellspacing="0"
                                               border="0">

                                            <tr>

                                                <th align="left"
                                                    style="
                                                        padding-bottom:10px;
                                                        font-size:11px;
                                                        color:#777777;
                                                        text-transform:uppercase;
                                                    ">
                                                    Product
                                                </th>

                                                <th align="center"
                                                    style="
                                                        padding-bottom:10px;
                                                        font-size:11px;
                                                        color:#777777;
                                                        text-transform:uppercase;
                                                    ">
                                                    Qty
                                                </th>

                                                <th align="right"
                                                    style="
                                                        padding-bottom:10px;
                                                        font-size:11px;
                                                        color:#777777;
                                                        text-transform:uppercase;
                                                    ">
                                                    Amount
                                                </th>

                                            </tr>

                """
                + itemsHtml
                + """

                                        </table>

                                    </td>
                                </tr>

                                <!-- TOTAL -->

                                <tr>
                                    <td style="padding:0 35px 30px;">

                                        <table width="100%%"
                                               cellpadding="0"
                                               cellspacing="0"
                                               border="0">

                                            <tr>

                                                <td style="
                                                    padding:8px 0;
                                                    color:#888888;
                                                    font-size:13px;
                                                ">
                                                    Subtotal
                                                </td>

                                                <td align="right"
                                                    style="
                                                        padding:8px 0;
                                                        color:#ffffff;
                                                        font-size:13px;
                                                    ">
                """
                + formatAmount(
                        order.getSubtotal()
                  )
                + """
                                                </td>

                                            </tr>

                                            <tr>

                                                <td style="
                                                    padding:8px 0;
                                                    color:#888888;
                                                    font-size:13px;
                                                ">
                                                    Delivery
                                                </td>

                                                <td align="right"
                                                    style="
                                                        padding:8px 0;
                                                        color:#ffffff;
                                                        font-size:13px;
                                                    ">
                """
                + (
                    order.getDeliveryCharge() == 0
                        ? "FREE"
                        : formatAmount(
                            order.getDeliveryCharge()
                          )
                  )
                + """
                                                </td>

                                            </tr>

                                            <tr>

                                                <td style="
                                                    padding:18px 0 0;
                                                    border-top:1px solid #333333;
                                                    color:#ffffff;
                                                    font-size:17px;
                                                    font-weight:700;
                                                ">
                                                    Total
                                                </td>

                                                <td align="right"
                                                    style="
                                                        padding:18px 0 0;
                                                        border-top:1px solid #333333;
                                                        color:#c9a227;
                                                        font-size:19px;
                                                        font-weight:700;
                                                    ">
                """
                + formatAmount(
                        order.getTotal()
                  )
                + """
                                                </td>

                                            </tr>

                                        </table>

                                    </td>
                                </tr>

                                <!-- PAYMENT -->

                                <tr>
                                    <td style="
                                        padding:25px 35px;
                                        background:#0b0b0b;
                                        border-top:1px solid #262626;
                                        border-bottom:1px solid #262626;
                                    ">

                                        <table width="100%%"
                                               cellpadding="0"
                                               cellspacing="0"
                                               border="0">

                                            <tr>

                                                <td>

                                                    <div style="
                                                        font-size:11px;
                                                        color:#777777;
                                                        text-transform:uppercase;
                                                    ">
                                                        Payment Status
                                                    </div>

                                                    <div style="
                                                        margin-top:6px;
                                                        color:#ffffff;
                                                        font-size:14px;
                                                        font-weight:600;
                                                    ">
                """
                + escapeHtml(
                        order.getPaymentStatus()
                  )
                + """
                                                    </div>

                                                </td>

                                                <td align="right">

                                                    <div style="
                                                        font-size:11px;
                                                        color:#777777;
                                                        text-transform:uppercase;
                                                    ">
                                                        Order ID
                                                    </div>

                                                    <div style="
                                                        margin-top:6px;
                                                        color:#ffffff;
                                                        font-size:14px;
                                                        font-weight:600;
                                                    ">
                                                        #"""
                + order.getId()
                + """
                                                    </div>

                                                </td>

                                            </tr>

                                        </table>

                                    </td>
                                </tr>

                                <!-- SHIPMENT -->

                """
                + shipmentHtml
                + """

                                <!-- DELIVERY -->

                                <tr>
                                    <td style="padding:30px 35px;">

                                        <div style="
                                            font-size:16px;
                                            font-weight:600;
                                            color:#ffffff;
                                            margin-bottom:14px;
                                        ">
                                            Delivery Details
                                        </div>

                                        <div style="
                                            color:#aaaaaa;
                                            font-size:13px;
                                            line-height:1.8;
                                        ">

                                            <strong style="color:#ffffff;">
                                                """
                + customerName
                + """
                                            </strong>
                                            <br>

                                            """
                + address
                + """
                                            <br>

                                            """
                + city
                + ", "
                + state
                + " - "
                + pincode
                + """

                                        </div>

                                    </td>
                                </tr>

                                <!-- FOOTER -->

                                <tr>
                                    <td style="
                                        padding:30px 35px;
                                        text-align:center;
                                        background:#080808;
                                        border-top:1px solid #262626;
                                    ">

                                        <div style="
                                            font-size:22px;
                                            font-weight:700;
                                            letter-spacing:4px;
                                            color:#ffffff;
                                        ">
                                            VAELIS
                                        </div>

                                        <div style="
                                            margin-top:10px;
                                            font-size:11px;
                                            color:#777777;
                                            letter-spacing:1px;
                                        ">
                                            Designed for extraordinary sound.
                                        </div>

                                        <div style="
                                            margin-top:20px;
                                            font-size:11px;
                                            color:#555555;
                                        ">
                                            Thank you for choosing VAELIS.
                                        </div>

                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>

                </table>

                </body>
                </html>
                """;
    }

    // =========================================================
    // SHIPMENT HTML FOR STATUS/CONFIRMATION EMAIL
    // =========================================================

    private String buildShipmentHtml(
            Order order) {

        boolean hasShipment =
                (order.getShippingPartner() != null &&
                 !order.getShippingPartner().isBlank())
                ||
                (order.getTrackingNumber() != null &&
                 !order.getTrackingNumber().isBlank());

        if (!hasShipment) {
            return "";
        }

        String shippingPartner =
                escapeHtml(
                        order.getShippingPartner()
                );

        String trackingNumber =
                escapeHtml(
                        order.getTrackingNumber()
                );

        String expectedDate =
                "";

        if (order.getExpectedDeliveryDate() != null) {

            expectedDate =
                    order.getExpectedDeliveryDate()
                            .format(
                                    DateTimeFormatter.ofPattern(
                                            "dd MMM yyyy"
                                    )
                            );
        }

        String trackingButton =
                "<div style='margin-top:24px;text-align:center;'>"
                +
                "<a href='"
                +
                escapeHtml(
                        frontendUrl
                                + "/track-order/"
                                + order.getId()
                )
                +
                "' style='"
                + "display:inline-block;"
                + "padding:13px 25px;"
                + "background:#c9a227;"
                + "color:#050505;"
                + "text-decoration:none;"
                + "border-radius:8px;"
                + "font-size:12px;"
                + "font-weight:700;"
                + "letter-spacing:1px;"
                + "'>"
                +
                "TRACK YOUR ORDER"
                +
                "</a>"
                +
                "</div>";

        return """
                <tr>

                    <td style="
                        padding:30px 35px;
                        background:#0b0b0b;
                        border-top:1px solid #262626;
                        border-bottom:1px solid #262626;
                    ">

                        <div style="
                            font-size:16px;
                            font-weight:600;
                            color:#ffffff;
                            margin-bottom:20px;
                        ">
                            Shipment Details
                        </div>

                        <table width="100%%"
                               cellpadding="0"
                               cellspacing="0"
                               border="0">

                            <tr>

                                <td width="50%%"
                                    style="padding:10px 0;">

                                    <div style="
                                        font-size:11px;
                                        color:#777777;
                                        text-transform:uppercase;
                                    ">
                                        Shipping Partner
                                    </div>

                                    <div style="
                                        margin-top:6px;
                                        color:#ffffff;
                                        font-size:14px;
                                        font-weight:600;
                                    ">
                                        """
                + shippingPartner
                + """
                                    </div>

                                </td>

                                <td width="50%%"
                                    align="right"
                                    style="padding:10px 0;">

                                    <div style="
                                        font-size:11px;
                                        color:#777777;
                                        text-transform:uppercase;
                                    ">
                                        Tracking Number
                                    </div>

                                    <div style="
                                        margin-top:6px;
                                        color:#ffffff;
                                        font-size:14px;
                                        font-weight:600;
                                    ">
                                        """
                + trackingNumber
                + """
                                    </div>

                                </td>

                            </tr>

                            <tr>

                                <td colspan="2"
                                    style="padding-top:18px;">

                                    <div style="
                                        font-size:11px;
                                        color:#777777;
                                        text-transform:uppercase;
                                    ">
                                        Expected Delivery
                                    </div>

                                    <div style="
                                        margin-top:6px;
                                        color:#c9a227;
                                        font-size:15px;
                                        font-weight:600;
                                    ">
                                        """
                + (
                    expectedDate.isBlank()
                        ? "To be confirmed"
                        : expectedDate
                  )
                + """
                                    </div>

                                </td>

                            </tr>

                        </table>

                """
                + trackingButton
                + """

                    </td>

                </tr>
                """;
    }

    // =========================================================
    // FORMAT AMOUNT
    // =========================================================

    private String formatAmount(
            double amount) {

        return "₹" +
                String.format(
                        "%,.2f",
                        amount
                );
    }

    // =========================================================
    // STATUS COLOR
    // =========================================================

    private String getStatusColor(
            String status) {

        if (status == null) {
            return "#555555";
        }

        return switch (
                status.toUpperCase()
        ) {

            case "CONFIRMED" ->
                    "#2563eb";

            case "PROCESSING" ->
                    "#7c3aed";

            case "SHIPPED" ->
                    "#0891b2";

            case "DELIVERED" ->
                    "#16a34a";

            case "CANCELLED" ->
                    "#dc2626";

            default ->
                    "#c9a227";
        };
    }

    // =========================================================
    // ESCAPE HTML
    // =========================================================

    private String escapeHtml(
            String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace(
                        "&",
                        "&amp;"
                )
                .replace(
                        "<",
                        "&lt;"
                )
                .replace(
                        ">",
                        "&gt;"
                )
                .replace(
                        "\"",
                        "&quot;"
                )
                .replace(
                        "'",
                        "&#39;"
                );
            }
                // =========================================================
// FORMAT CUSTOMER FIRST NAME
// =========================================================

private String formatCustomerFirstName(
        String customerName) {

    if (customerName == null ||
            customerName.isBlank()) {

        return "Customer";
    }

    String firstName =
            customerName
                    .trim()
                    .split("\\s+")[0];

    if (firstName.isBlank()) {
        return "Customer";
    }

    firstName =
            firstName.substring(0, 1).toUpperCase()
            + firstName.substring(1).toLowerCase();

    return escapeHtml(firstName);

    }
}