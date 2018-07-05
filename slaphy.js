(() => {
  const zwsp = ['\u200b', '\u200c', '\u200d', '\u200e', '\u202a', '\u202d', '\u2062', '\u2063'];
  const delimiter = '\u2061';

  const encode = text => text.replace(/\^\^\^(.*?)\^\^\^/g, (_, match) => {
    const ary = Array.from(new Uint16Array([].map.call(match, c => c.charCodeAt(0))));
    const str = ary.map(c => [15, 12, 9, 6, 3, 0].map(b => zwsp[(c >> b) & 0x7]).join('')).join('');
    return `${delimiter}${str}${delimiter}`;
  });

  const decode = text => text.replace((new RegExp(`${delimiter}(.*?)${delimiter}`, 'g')), (_, match) => {
    const ary = Array(Math.floor(match.length / 6));
    ary.fill(0);
    for (let i = 0; i < match.length; i++) {
      ary[Math.floor(i / 6)] = (ary[Math.floor(i / 6)] << 3) + zwsp.indexOf(match[i]);
    }
    const str = String.fromCharCode.apply('', Uint16Array.from(ary));
    return `<u>${str}</u>`
  });

  Array.prototype.forEach.call(document.querySelectorAll('.c-message__body'), elm => {
    elm.innerHTML = decode(elm.innerHTML);
  });
  const editor = document.querySelectorAll('.msg_input_wrapper .ql-editor p');
  editor.forEach(e => e.innerHTML = encode(e.innerHTML))
})();
