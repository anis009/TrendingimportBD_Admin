export const template = `<!DOCTYPE html>
<html>

<head>
  <meta name="viewport" content="width=device-width">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="stylesheet" href="style.css">
  <title>Simple Email for FCFL</title>
  <style>
    @media only screen and (max-width: 620px) {
      table[class="body"] h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }

      table[class="body"] p,
      table[class="body"] ul,
      table[class="body"] ol,
      table[class="body"] td,
      table[class="body"] span,
      table[class="body"] a {
        font-size: 16px !important;
      }

      table[class="body"] .wrapper,
      table[class="body"] .article {
        padding: 10px !important;
      }

      table[class="body"] .content {
        padding: 0 !important;
      }

      table[class="body"] .container {
        padding: 0 !important;
        width: 100% !important;
      }

      table[class="body"] .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }

      table[class="body"] .btn table {
        width: 100% !important;
      }

      table[class="body"] .btn a {
        width: 100% !important;
      }

      table[class="body"] .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }

    @media screen and (max-width: 620px) {
      .header-box {
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;
      }

      .template-header {
        margin-top: 40px;
        justify-content: center;
        width: 100%;
      }

      .template-header-img {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 20px;
      }

      .dear-text {
        margin-top: 10px;
      }

      .airlines-subcontainer {
        flex-direction: column;
      }

      .airlines-subcontainer-left {
        width: 100%;
        margin-bottom: 10px;
        border-right: none !important;
      }
    }

    @media all {
      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }

      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }

      .btn-primary table td:hover {
        background-color: #d5075d !important;
      }

      .btn-primary a:hover {
        background-color: #d5075d !important;
        border-color: #d5075d !important;
      }
    }
  </style>
</head>

<body class
  style="background-color: #001b4c; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; max-width: 1718px;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body"
    style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background-color: #001b4c; width: 100%; margin: auto; font-family: 'Inter', sans-serif;"
    width="100%" bgcolor="#001b4c">
    <tr>
      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
      <td class="container"
        style="font-size: 14px; vertical-align: top; display: block; padding-top: 63px; padding-bottom: 63px; width: 60%; margin: 0 auto; font-family: 'Inter', sans-serif;"
        width="60%" valign="top">
        <div class="header-box" style="display: flex; justify-content: space-between; align-items: flex-start;">
          <img class="template-header-img" src="https://i.ibb.co/qRqtMRj/fcfl-logo.png"
            style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;">
          <div class="template-header" style="display: flex; align-items: center;">
            <div>
              <p class="header header-name"
                style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-size: 16px; line-height: 20px; text-align: right; color: rgba(255, 255, 255, 0.6); font-weight: 400;">
                Prepared by Dennis Martin</p>
              <p class="header header-phone"
                style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-size: 16px; line-height: 20px; text-align: right; color: white; font-weight: 600;">
                 +1 123-123-1234</p>
              <p class="header header-email"
                style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-size: 16px; line-height: 20px; text-align: right; color: white; font-weight: 600;">
                dennis@firstclassflightforless.com
              </p>
            </div>
            <img class="header-profile-img" src="https://i.ibb.co/mJm8GQD/8bc808706029e890e2320ee5015472cc.png"
              style="-ms-interpolation-mode: bicubic; max-width: 100%; width: 95px; height: 95px; border-radius: 100%; border: 2px solid rgba(247, 186, 0, 1); margin-left: 21.85px;"
              width="95" height="95">
          </div>
        </div>

        <div class="email-body">
          <p class="dear-text dear-text-res"
            style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-weight: 600; font-size: 21.66px; line-height: 30.32px; color: #fff;">
            Dear John,</p>

          <div class="thank-text">
            <span
              style="font-weight: 400; font-size: 17.32px; line-height: 30.32px; color: rgba(255, 255, 255, 0.6);">Thank
              you for choosing </span>
            <span
              style="font-weight: 400; font-size: 17.32px; line-height: 30.32px; color: rgba(247, 186, 0, 1);">firstclassforless.com
            </span>
          </div>
          <div class="below-text"
            style="font-weight: 400; font-size: 17.32px; line-height: 30.32px; color: rgba(255, 255, 255, 0.6); margin-bottom: 50px;">
            Below you will find the ticket option currently available per your
            request.
          </div>

          <!-- airlines section -->

          <ul class
            style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px; color: white; list-style: none; width: 100%; padding: 0;">
            <li style="list-style-position: inside; margin-left: 5px;">
              <!-- header -->
              <div style="display: flex; justify-content: space-between">
                <p
                  style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
                  1. New York - London</p>

                <div style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    ">
                  <img src="https://i.ibb.co/qNw6Hrq/Vector.png" alt
                    style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;">
                  <p
                    style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin-bottom: 15px; padding: 0; margin: 0; color: rgba(247, 186, 0, 1);">
                    Flight duration: 7h 31m
                  </p>
                </div>
              </div>

              <div class="airlines-subcontainer"
                style="background-color: white; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; padding: 20px; border-radius: 5px; margin-top: 20px;">
                <div style="
                      border-right: 2px solid gainsboro;
                      padding-right: 10px;
                    " class="airlines-subcontainer-left">
                  <img src="https://i.ibb.co/TYn5dxJ/Rectangle-40187.png" alt class="airlines-subcontainer-left-img"
                    style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%; position: relative; left: 50%; transform: translateX(-50%); margin-bottom: 10px;">
                  <div style="color: black">
                    <p
                      style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-size: 17.32px; line-height: 20.97px; font-weight: 400; text-align: center;">
                      B6 1107
                    </p>
                    <p
                      style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-size: 17.32px; line-height: 20.97px; font-weight: 600; text-align: center; color: rgba(42, 67, 166, 1);">
                      BUSINESS
                    </p>
                    <p
                      style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-size: 14.44px; line-height: 17.47px; font-weight: 400; text-align: center; color: rgba(32, 32, 32, 1);">
                      Airbus A321neo
                    </p>
                  </div>
                </div>

                <div class="airlines-subcontainer-right">
                  <div style="
                        color: black;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                      ">
                    <img src="https://i.ibb.co/vsPFRhR/Vector-1.png" alt class
                      style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%; margin-right: 15px;">

                    <div>
                      <span style="
                            font-size: 15.88px;
                            font-weight: 400;
                            line-height: 19.22px;
                            color: black;
                          ">Sat, 30 Dec</span>
                      <span style="
                            font-family: Inter;
                            font-size: 15.88px;
                            font-weight: 700;
                            line-height: 19.22px;
                            text-align: left;
                            color: black;
                          ">8:14 AM</span>
                    </div>
                  </div>
                  <div style="
                        border-left: 2px dotted black;
                        padding-left: 15px;
                        margin-left: 2px;
                      ">
                    <div style="margin-top: 14px">
                      <span style="
                            font-family: Inter;
                            font-size: 15.88px;
                            font-weight: 400;
                            line-height: 19.22px;
                            text-align: left;
                            color: black;
                          ">New York •
                      </span>
                      <span style="
                            font-family: Inter;
                            font-size: 15.88px;
                            font-weight: 700;
                            line-height: 19.22px;
                            text-align: left;
                            color: black;
                          ">United States John F Kennedy Intl (JFK)</span>
                    </div>

                    <div style="margin-top: 22px">
                      <p
                        style="margin: 0; margin-bottom: 15px; font-family: Inter; font-size: 12.99px; font-weight: 400; line-height: 15.73px; text-align: left; color: rgba(0, 43, 114, 1);">
                        Flight duration: 7h 31m
                      </p>
                    </div>
                  </div>
                  <div style="
                        color: black;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                      ">
                    <img src="https://i.ibb.co/vsPFRhR/Vector-1.png" alt
                      style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%; margin-right: 15px;">
                    <!-- <img src="https://i.ibb.co/qNw6Hrq/Vector.png" alt="" /> -->

                    <div>
                      <span style="
                            font-size: 15.88px;
                            font-weight: 400;
                            line-height: 19.22px;
                            color: black;
                          ">Sat, 30 Dec</span>
                      <span style="
                            font-family: Inter;
                            font-size: 15.88px;
                            font-weight: 700;
                            line-height: 19.22px;
                            text-align: left;
                            color: black;
                          ">8:14 AM</span>
                    </div>
                  </div>
                  <div style="margin-top: 14px">
                    <span style="
                          font-family: Inter;
                          font-size: 15.88px;
                          font-weight: 400;
                          line-height: 19.22px;
                          text-align: left;
                          color: black;
                        ">
                      London •
                    </span>
                    <span style="
                          font-family: Inter;
                          font-size: 15.88px;
                          font-weight: 700;
                          line-height: 19.22px;
                          text-align: left;
                          color: black;
                        ">United Kingdom Heathrow (LHR)</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <!-- airlines section -->

          <!-- total price -->

          <div style="position: relative; height: 150px; margin-top: 70px">
            <div style="
                  background-color: white;
                  height: 90px;
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  padding: 17px;
                  border-radius: 5px;
                  border-color: rgba(247, 186, 0, 1);
                  border-width: 1.44px;
                  border-style: solid;
                  z-index: 100;
                  position: absolute;
                  width: 100%;
                  box-sizing: border-box;
                  padding: 17px 15px;
                ">
              <img src="https://i.ibb.co/LgGXdz2/path86.png"
                style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%; margin-right: 24px;" alt="key">
              <div>
                <div>
                  <span style="
                        font-size: 18.77px;
                        line-height: 22.71px;
                        font-weight: 400;
                        color: black;
                      ">Your Total Price:
                  </span>
                  <span style="
                        font-size: 18.77px;
                        line-height: 22.71px;
                        font-weight: 700;
                        color: black;
                      ">
                    $10,836.23
                  </span>
                </div>
                <p
                  style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-size: 13; line-height: 16px; font-weight: 400; color: black; margin-top: 8px;">
                  3x Adults: $3,456.56
                </p>
              </div>
            </div>
            <div style="
                  position: absolute;
                  height: 95px;
                  border-color: rgba(247, 186, 0, 1);
                  border-width: 1.44px;
                  border-style: solid;
                  width: 95%;
                  left: 2.5%;
                  top: 0px;
                  box-sizing: border-box;
                  border-radius: 5px;
                  background-color: white;
                "></div>
          </div>
          <!-- total price -->

          <div class="quote-text"
            style="font-weight: 600; font-size: 17.32px; line-height: 30.32px; color: rgba(255, 120, 57, 1); text-align: center;">
            The quoted prices are not guaranteed until the tickets are issued
          </div>

          <!-- footer -->

          <div class="footer-section" style="margin-top: 47px;">
            <p class="dear-text"
              style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-weight: 600; font-size: 21.66px; line-height: 30.32px; color: #fff;">
              Sincerely,</p>
            <p class="dear-text"
              style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-weight: 600; font-size: 21.66px; line-height: 30.32px; color: #fff;">
              Dennis Martin</p>
            <p class="footer-para-text"
              style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-size: 17.32px; font-weight: 400; line-height: 36px; color: rgba(255, 255, 255, 0.6);">
              If you have additional questions or requests concerning your
              trip, you can contact me by phone, or simply replying to this
              email.
            </p>
            <p class="footer-phone"
              style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-size: 17.32px; line-height: 30.32px; color: white; font-weight: 700;">
              +1 123-123-1234</p>
            <p class="footer-email"
              style="font-family: sans-serif; margin: 0; font-size: 17.32px; line-height: 30.32px; color: white; font-weight: 600; margin-bottom: 55px;">
              dennis@firstclassflightforless.com</p>
            <hr
              style="background-color: rgba(247, 186, 0, 1); height: 1.44px; border: 0; border-bottom: 1px solid #f6f6f6; margin: 20px 0;">
            <p
              style="font-family: sans-serif; margin: 0; margin-bottom: 15px; text-align: center; font-weight: 400; font-size: 17.32px; line-height: 30.32px; color: white; margin-top: 23px;">
              First Class For Less
            </p>
            <div style="
                  text-align: center;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin-top: 10px;
                ">
              <a href="#"
                style="text-decoration: underline; margin-right: 46px; color: rgba(247, 186, 0, 1); font-weight: 400; font-size: 17.32px; line-height: 30.32px;">Privacy
                Policy</a>
              <a href="#"
                style="text-decoration: underline; margin-right: 46px; color: rgba(247, 186, 0, 1); font-weight: 400; font-size: 17.32px; line-height: 30.32px;">Terms
                & Conditions</a>
            </div>
          </div>
          <!-- footer -->
        </div>
      </td>
    </tr>
  </table>
</body>

</html>`

export const smallEmail = `<table role="presentation" cellpadding="0" cellspacing="0" class="body"
style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background-color: #001b4c; width: 100%; margin: auto; font-family: 'Inter', sans-serif;"
width="100%">
<tr>
  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
  <td class="container"
    style="font-size: 14px; vertical-align: top; display: block; padding-top: 63px; padding-bottom: 63px; width: 60%; margin: 0 auto; font-family: 'Inter', sans-serif;"
    width="60%" valign="top">


    <div class="email-body">
      <p class="dear-text dear-text-res"
        style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-weight: 600; font-size: 21.66px; line-height: 30.32px; color: #fff;">
        Dear John,</p>

      <div class="thank-text">
        <span
          style="font-weight: 400; font-size: 17.32px; line-height: 30.32px; color: rgba(255, 255, 255, 0.6);">Thank
          you for choosing </span>
        <span
          style="font-weight: 400; font-size: 17.32px; line-height: 30.32px; color: rgba(247, 186, 0, 1);">firstclassforless.com
        </span>
      </div>
      <div class="below-text"
        style="font-weight: 400; font-size: 17.32px; line-height: 30.32px; color: rgba(255, 255, 255, 0.6); margin-bottom: 50px;">
        Below you will find the ticket option currently available per your
        request.
      </div>

      <div class="quote-text"
        style="font-weight: 600; font-size: 17.32px; line-height: 30.32px; color: rgba(255, 120, 57, 1); text-align: center;">
        The quoted prices are not guaranteed until the tickets are issued
      </div>

      <!-- footer -->

      <div class="footer-section" style="margin-top: 47px;">
        <p class="dear-text"
          style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-weight: 600; font-size: 21.66px; line-height: 30.32px; color: #fff;">
          Sincerely,</p>
        <p class="dear-text"
          style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-weight: 600; font-size: 21.66px; line-height: 30.32px; color: #fff;">
          Dennis Martin</p>
        <p class="footer-para-text"
          style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-size: 17.32px; font-weight: 400; line-height: 36px; color: rgba(255, 255, 255, 0.6);">
          If you have additional questions or requests concerning your
          trip, you can contact me by phone, or simply replying to this
          email.
        </p>
        <p class="footer-phone"
          style="font-family: sans-serif; margin: 0; margin-bottom: 15px; font-size: 17.32px; line-height: 30.32px; color: white; font-weight: 700;">
          +1 123-123-1234</p>
        <p class="footer-email"
          style="font-family: sans-serif; margin: 0; font-size: 17.32px; line-height: 30.32px; color: white; font-weight: 600; margin-bottom: 55px;">
          dennis@firstclassflightforless.com</p>
        <hr
          style="background-color: rgba(247, 186, 0, 1); height: 1.44px; border: 0; border-bottom: 1px solid #f6f6f6; margin: 20px 0;">
        <p
          style="font-family: sans-serif; margin: 0; margin-bottom: 15px; text-align: center; font-weight: 400; font-size: 17.32px; line-height: 30.32px; color: white; margin-top: 23px;">
          First Class For Less
        </p>
        <div style="
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 10px;
              ">
          <a href="#"
            style="text-decoration: underline; margin-right: 46px; color: rgba(247, 186, 0, 1); font-weight: 400; font-size: 17.32px; line-height: 30.32px;">Privacy
            Policy</a>
          <a href="#"
            style="text-decoration: underline; margin-right: 46px; color: rgba(247, 186, 0, 1); font-weight: 400; font-size: 17.32px; line-height: 30.32px;">Terms
            & Conditions</a>
        </div>
      </div>
      <!-- footer -->
    </div>
  </td>
</tr>
</table>`