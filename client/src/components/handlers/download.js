const downloadFile = (format,value) => {
    const blob = new Blob([value], { type: 'text/plain' });
    const fileExtension = format.toLowerCase();
    const fileName = `data.${fileExtension}`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const convertToCSV = (obj) => {
    const rows = [];
    const headers = Object.keys(obj[0]);
    rows.push(headers.join(','));

    obj.forEach(item => {
        rows.push(headers.map(header => item[header]).join(','));
    });

    return rows.join('\n');
};

const convertToXML = (obj) => {
    const convert = (obj) => {
        return Object.keys(obj)
            .map(key =>
                typeof obj[key] === 'object' && obj[key] !== null
                    ? `<${key}>${convert(obj[key])}</${key}>`
                    : `<${key}>${obj[key]}</${key}>`
            ).join('');
    };
    return `<root>${convert(obj)}</root>`;
};

const convertToPlainText = (data, indent = 0) => {
    return Object.keys(data).map(key => {
        const value = data[key];
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize keys
        if (typeof value === 'object' && value !== null) {
            return `${' '.repeat(indent)}${formattedKey}:\n${convertToPlainText(value, indent + 2)}`;
        } else {
            return `${' '.repeat(indent)}${formattedKey}: ${value}`;
        }
    }).join('\n');
};

export { downloadFile, convertToCSV, convertToXML, convertToPlainText };