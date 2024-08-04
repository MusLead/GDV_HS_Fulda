export function loadGeoFromUSDA(geoRaw: string) {
    // Extract vertex position from a .usda file:
    // point3f[] points = [(...

    // Regex pattern to match the desired array
    const pattern = /point3f\[\] points = \[(.*?)\]/;

    // Extract the array using the pattern
    const match = geoRaw.match(pattern);

    if (match) {
        // Extract the contents inside the square brackets
        const arrayContents = match[1];
        // Regex pattern to match each point inside the array contents
        const pointPattern = /\(\s*(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)\s*\)/g;
        // Match all points in the array contents
        const pointMatches = arrayContents.match(pointPattern);
        if (!pointMatches) return false;
        // Convert matched points to the desired format
        const data = pointMatches.map(point => {
            // Extract numbers from the matched point
            const numbers = point.match(/-?\d+(\.\d+)?/g);
            if (!numbers) return false;
            // Convert strings to numbers and return as an array
            return numbers.map(Number);
        });
        return data
    } else {
        return false
    }
}

export function loadGeoFromOBJ(objRaw: string) {
    // Extract vertex position from a .obj file:
    // v -1.000000 1.000000 -1.000000

    // load obj
    var objLines = objRaw.split('\n');
    // extract vertices
    const vertices: string[][] = []
    objLines.map((line) => {
        if (line.startsWith("v ")) {
            const lineItems = line.split(" ")
            lineItems.shift();
            vertices.push(lineItems)

        }
    })


    // extract faces
    const faces: string[][][] = []
    objLines.map((line) => {
        if (line.startsWith("f ")) {
            const lineItems = line.split(" ")
            // remove 'f ' from beginnning
            lineItems.shift();
            // split each set by / and add to faces array
            faces.push(lineItems.map(item => item.split("/")))
        }
    })
    console.info(faces)
    return { vertices, faces }
}