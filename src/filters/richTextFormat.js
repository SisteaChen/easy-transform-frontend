function richTextFormat(value) {
    // value = value.replace(/<\/?[^>]*>/g,'')
    value = value.replace(/<\/?.+?>/g,'')
    value = value.replace(/\s+/g,'')
    if (value.length > 30) {
        return value.slice(0, 30) + "...";
    }
    return value;
}

export default richTextFormat