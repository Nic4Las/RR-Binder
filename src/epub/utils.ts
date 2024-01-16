
/**
 * https://stackoverflow.com/a/27979933/1339693
 */
export function escapeXml(unsafe: string) {

    const matches = unsafe.match(/[<>&'"]/g);

    if (matches) {
        matches.forEach((c) => {
            let replacement = "";
            switch (c) {
                case "<":
                    replacement = "&lt;";
                    break;
                case ">":
                    replacement = "&gt;";
                    break;
                case "&":
                    replacement = "&amp;";
                    break;
                case "'":
                    replacement = "&apos;";
                    break;
                case '"':
                    replacement = "&quot;";
                    break;
            }
            unsafe = unsafe.replace(c, replacement);
        });
    }
    return unsafe;
}