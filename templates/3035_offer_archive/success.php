<?php
session_start();

if (isset($_SESSION['redirect_url'])) {
    $redirectUrl = $_SESSION['redirect_url'];
    
    if (isset($_GET['cvu'])) {
        $redirectUrl .= '?cvu=' . $_GET['cvu'];
    }
    unset($_SESSION['redirect_url']);
} else {
    $redirectUrl = 'default-url.php'; 
}
 
if (isset($_GET['cvu'])) {
    $cvu = $_GET['cvu'];
} else {
    $cvu = 'cvu not set';
}
?>
<!doctype html>
<html lang="pt">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="success_files/style.css" />
        <meta name="referrer" content="no-referrer" />
        <title>Você se registrou com sucesso!</title>
        <script>
            !(function (f, b, e, v, n, t, s) {
                if (f.fbq) return;
                n = f.fbq = function () {
                    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = "2.0";
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s);
            })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
            fbq("init", "<?= $cvu; ?>");
            fbq("track", "PageView");
            fbq("track", "Lead");
            fbq("track", "CompleteRegistration");
        </script>
        <noscript
            ><img height="1" width="1" style="display: none" src="https://www.facebook.com/tr?id=<?= $cvu; ?>&ev=Lead&noscript=1"
        /></noscript>

        <script type="text/javascript">
            function delayedRedirect(url) {
                setTimeout(function () {
                    window.location.href = url;
                }, 2000);
            }
        </script>
    </head>
    <body class="thank_page_main" onload="delayedRedirect('<?php echo htmlspecialchars($redirectUrl); ?>')">
        <img
            style="display: none"
            src="https://www.facebook.com/tr?id=241009372167667&ev=Lead&noscript=1"
            width="1px"
            height="1px"
        />
        <img
            style="display: none"
            src="https://www.facebook.com/tr?id=919359989788478&ev=Lead&noscript=1"
            width="1px"
            height="1px"
        />
        <img
            style="display: none"
            src="https://www.facebook.com/tr?id=271988698790753&ev=Lead&noscript=1"
            width="1px"
            height="1px"
        />
        <img
            style="display: none"
            src="https://www.facebook.com/tr?id=660258464644901&ev=Lead&noscript=1"
            width="1px"
            height="1px"
        />

        <div class="thank_page_body">
            <div class="thank_page_wrap">
                <div class="thank_page_image"></div>
                <p class="title_message"></p>
                <p class="sub_title_message">Você se registrou com sucesso!</p>
                <p class="message">
                    Certifique-se de atender a ligação do nosso gerente,
                    <br />
                    para garantir sua vaga no programa!
                </p>
            </div>
        </div>
    </body>
</html>
