import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner({ onScan }) {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                }
            },
            false
        );

        const handleSuccess = (decodedText) => {
            onScan(decodedText);
        };

        const handleError = () => {
            // Ignore unsuccessful scan attempts
        };

        scanner.render(handleSuccess, handleError);

        return () => {
            scanner.clear().catch(() => {});
        };
    }, [onScan]);

    return <div id="qr-reader"></div>;
}

export default QRScanner;