<?php
// ===== Basic config =====
$companyEmail = "info@dach-mallonn.de";
$redirectUrl  = "kontakt.html"; // adjust path if needed

// helper: safe get field
function field($name, $required = false) {
    $val = isset($_POST[$name]) ? trim($_POST[$name]) : '';
    if ($required && $val === '') {
        throw new Exception("missing:$name");
    }
    return $val;
}

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("invalid_method");
    }

    // Required fields
    $vorname   = field('vorname', true);
    $nachname  = field('nachname', true);
    $emailRaw  = field('email', true);
    $telefon   = field('telefon', true);
    $plz       = field('plz', true);
    $nachricht = field('nachricht', true);

    // Optional
    $strasse    = field('strasse', false);
    $hausnummer = field('hausnummer', false);
    $ort        = field('ort', false);

    // DSGVO checkbox
    if (!isset($_POST['dsgvo'])) {
        throw new Exception("dsgvo");
    }

    // Spam check (static 7+5)
    if (!isset($_POST['spam']) || intval($_POST['spam']) !== 12) {
        throw new Exception("spam");
    }

    // Validate email
    $email = filter_var($emailRaw, FILTER_VALIDATE_EMAIL);
    if (!$email) {
        throw new Exception("email");
    }

    // Sanitise for output
    $safe = function($s){ return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); };

    $date = date("Y-m-d");
    $subjectCompany = "Anfrage_{$date}";
    $subjectUser    = "Ihre Anfrage_{$date}";

    // Message to company
    $msgCompany =
"Neue Anfrage: {$date}\n\n".
"Vorname: {$vorname}\n".
"Nachname: {$nachname}\n".
"E-Mail: {$email}\n".
"Telefon: {$telefon}\n".
"Straße: {$strasse}\n".
"Hausnummer: {$hausnummer}\n".
"PLZ: {$plz}\n".
"Ort: {$ort}\n\n".
"Nachricht:\n{$nachricht}\n";

    // Confirmation to user
    $msgUser =
"Sehr geehrte/r {$vorname} {$nachname},\n\n".
"vielen Dank für Ihre Anfrage an Mallonn Dachtechnik.\n".
"Wir haben Ihre Nachricht erhalten und werden uns so bald wie möglich bei Ihnen melden.\n\n".
"Zusammenfassung Ihrer Angaben:\n".
"Telefon: {$telefon}\n".
"PLZ: {$plz}\n".
(!empty($ort) ? "Ort: {$ort}\n" : "").
"\nIhre Nachricht:\n{$nachricht}\n\n".
"Mit freundlichen Grüßen\n".
"Mallonn Dachtechnik\n".
"info@dach-mallonn.de\n";

    // Headers
    $headersCommon  = "MIME-Version: 1.0\r\n";
    $headersCommon .= "Content-Type: text/plain; charset=utf-8\r\n";
    $headersCommon .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    // Company mail: From company; Reply to user
    $headersCompany = $headersCommon .
                      "From: Mallonn Dachtechnik <{$companyEmail}>\r\n" .
                      "Reply-To: {$email}\r\n";

    // User mail: From company
    $headersUser = $headersCommon .
                   "From: Mallonn Dachtechnik <{$companyEmail}>\r\n" .
                   "Reply-To: {$companyEmail}\r\n";

    // Send mails
    $ok1 = @mail($companyEmail, $subjectCompany, $msgCompany, $headersCompany);
    $ok2 = @mail($email,        $subjectUser,    $msgUser,     $headersUser);

    if (!$ok1) { throw new Exception("send_company"); }
    // user mail failure is non-fatal; we log but still success
    if (!$ok2) {
        // optional: error_log("Kontaktform: user mail send failed for $email");
    }

    // success redirect
    header("Location: {$redirectUrl}?status=ok");
    exit;

} catch (Exception $ex) {
    // optional: error_log("Kontaktform error: " . $ex->getMessage());
    header("Location: {$redirectUrl}?status=err");
    exit;
}

