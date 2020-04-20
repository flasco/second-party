import cheerio from 'cheerio';

function quert(content: string, instStr: string) {
  let $ = cheerio.load(content, { decodeEntities: false })('html');

  const insts = instStr.split('!')[0].split('@');

  while (insts.length > 1) {
    const inst = insts.shift();
    $ = formatX(inst, $);
  }

  const resX = insts[0].includes('.')
    ? formatX(insts[0], $)
    : formatLatest(insts[0], $);
  return resX;
}

function formatX(inst, $: Cheerio) {
  const words = inst.split('.');
  switch (words[0]) {
    case 'class': {
      const rx = $.find('.' + words[1]);
      if (words[2] != null) return rx.eq(words?.[3] ?? 0);
      return rx;
    }
    case 'id': {
      const rx = $.find('#' + words[1]);
      if (words[2] != null) return rx.eq(words?.[3] ?? 0);
      return rx;
    }
    case 'tag': {
      const rx = $.find(words[1]);
      if (words[2] != null) return rx.eq(words?.[3] ?? 0);
      return rx;
    }
  }
  return $;
}

function formatLatest(key, $) {
  switch (key) {
    case 'text': {
      const x = [] as string[];
      for (let i = 0; i < $.length; i++) {
        x.push(cheerio($[i]).text());
      }
      return x.join('\n');
    }
    default: {
      const result = $.attr(key);
      return result;
    }
  }
}

export = quert;
