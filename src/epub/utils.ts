/**
 * https://stackoverflow.com/a/27979933/1339693
 */
export function escapeXml(string: string, ignore: string = "") {
    var pattern;

    if (string === null || string === undefined) return;

    ignore = (ignore || "").replace(/[^&"<>\']/g, "");
    pattern = "([&\"<>'])".replace(new RegExp("[" + ignore + "]", "g"), "");

    return string.replace(new RegExp(pattern, "g"), function (str, item) {
        return map[item];
    });
}

let map: Record<string, string> = {
    ">": "&gt;",
    "<": "&lt;",
    "'": "&apos;",
    '"': "&quot;",
    "&": "&amp;",
};
