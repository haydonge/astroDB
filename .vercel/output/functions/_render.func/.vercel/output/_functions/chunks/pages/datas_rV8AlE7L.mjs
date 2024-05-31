/* empty css                          */
import { A as AstroError, c as InvalidImageService, d as ExpectedImageOptions, E as ExpectedImage, F as FailedToFetchRemoteImageDimensions, e as createAstro, f as createComponent, g as ImageMissingAlt, r as renderTemplate, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, i as renderSlot, j as renderComponent, u as unescapeHTML, k as Fragment, l as renderHead } from '../astro_CTJ0b-Qy.mjs';
import 'kleur/colors';
import { cva } from 'class-variance-authority';
import 'clsx';
import { twMerge } from 'tailwind-merge';
import { getIconData, iconToSVG } from '@iconify/utils';
import { r as resolveSrc, i as isRemoteImage, a as isESMImportedImage, b as isLocalService, D as DEFAULT_HASH_PROPS } from '../astro/assets-service_CALzWIsc.mjs';
import { d as db, S as Stockonhand } from './_id__DLXKWOuF.mjs';

const decoder = new TextDecoder();
const toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
const toHexString = (input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i) => memo + ("0" + i.toString(16)).slice(-2), "");
const readInt16LE = (input, offset = 0) => {
  const val = input[offset] + input[offset + 1] * 2 ** 8;
  return val | (val & 2 ** 15) * 131070;
};
const readUInt16BE = (input, offset = 0) => input[offset] * 2 ** 8 + input[offset + 1];
const readUInt16LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8;
const readUInt24LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16;
const readInt32LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + (input[offset + 3] << 24);
const readUInt32BE = (input, offset = 0) => input[offset] * 2 ** 24 + input[offset + 1] * 2 ** 16 + input[offset + 2] * 2 ** 8 + input[offset + 3];
const readUInt32LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + input[offset + 3] * 2 ** 24;
const methods = {
  readUInt16BE,
  readUInt16LE,
  readUInt32BE,
  readUInt32LE
};
function readUInt(input, bits, offset, isBigEndian) {
  offset = offset || 0;
  const endian = isBigEndian ? "BE" : "LE";
  const methodName = "readUInt" + bits + endian;
  return methods[methodName](input, offset);
}
function readBox(buffer, offset) {
  if (buffer.length - offset < 4) return;
  const boxSize = readUInt32BE(buffer, offset);
  if (buffer.length - offset < boxSize) return;
  return {
    name: toUTF8String(buffer, 4 + offset, 8 + offset),
    offset,
    size: boxSize
  };
}
function findBox(buffer, boxName, offset) {
  while (offset < buffer.length) {
    const box = readBox(buffer, offset);
    if (!box) break;
    if (box.name === boxName) return box;
    offset += box.size;
  }
}

const BMP = {
  validate: (input) => toUTF8String(input, 0, 2) === "BM",
  calculate: (input) => ({
    height: Math.abs(readInt32LE(input, 22)),
    width: readUInt32LE(input, 18)
  })
};

const TYPE_ICON = 1;
const SIZE_HEADER$1 = 2 + 2 + 2;
const SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize$1(input, imageIndex) {
  const offset = SIZE_HEADER$1 + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
const ICO = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0) return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_ICON;
  },
  calculate(input) {
    const nbImages = readUInt16LE(input, 4);
    const imageSize = getImageSize$1(input, 0);
    if (nbImages === 1) return imageSize;
    const imgs = [imageSize];
    for (let imageIndex = 1; imageIndex < nbImages; imageIndex += 1) {
      imgs.push(getImageSize$1(input, imageIndex));
    }
    return {
      height: imageSize.height,
      images: imgs,
      width: imageSize.width
    };
  }
};

const TYPE_CURSOR = 2;
const CUR = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0) return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_CURSOR;
  },
  calculate: (input) => ICO.calculate(input)
};

const DDS = {
  validate: (input) => readUInt32LE(input, 0) === 542327876,
  calculate: (input) => ({
    height: readUInt32LE(input, 12),
    width: readUInt32LE(input, 16)
  })
};

const gifRegexp = /^GIF8[79]a/;
const GIF = {
  validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
  calculate: (input) => ({
    height: readUInt16LE(input, 8),
    width: readUInt16LE(input, 6)
  })
};

const brandMap = {
  avif: "avif",
  mif1: "heif",
  msf1: "heif",
  // hief-sequence
  heic: "heic",
  heix: "heic",
  hevc: "heic",
  // heic-sequence
  hevx: "heic"
  // heic-sequence
};
function detectBrands(buffer, start, end) {
  let brandsDetected = {};
  for (let i = start; i <= end; i += 4) {
    const brand = toUTF8String(buffer, i, i + 4);
    if (brand in brandMap) {
      brandsDetected[brand] = 1;
    }
  }
  if ("avif" in brandsDetected) {
    return "avif";
  } else if ("heic" in brandsDetected || "heix" in brandsDetected || "hevc" in brandsDetected || "hevx" in brandsDetected) {
    return "heic";
  } else if ("mif1" in brandsDetected || "msf1" in brandsDetected) {
    return "heif";
  }
}
const HEIF = {
  validate(buffer) {
    const ftype = toUTF8String(buffer, 4, 8);
    const brand = toUTF8String(buffer, 8, 12);
    return "ftyp" === ftype && brand in brandMap;
  },
  calculate(buffer) {
    const metaBox = findBox(buffer, "meta", 0);
    const iprpBox = metaBox && findBox(buffer, "iprp", metaBox.offset + 12);
    const ipcoBox = iprpBox && findBox(buffer, "ipco", iprpBox.offset + 8);
    const ispeBox = ipcoBox && findBox(buffer, "ispe", ipcoBox.offset + 8);
    if (ispeBox) {
      return {
        height: readUInt32BE(buffer, ispeBox.offset + 16),
        width: readUInt32BE(buffer, ispeBox.offset + 12),
        type: detectBrands(buffer, 8, metaBox.offset)
      };
    }
    throw new TypeError("Invalid HEIF, no size found");
  }
};

const SIZE_HEADER = 4 + 4;
const FILE_LENGTH_OFFSET = 4;
const ENTRY_LENGTH_OFFSET = 4;
const ICON_TYPE_SIZE = {
  ICON: 32,
  "ICN#": 32,
  // m => 16 x 16
  "icm#": 16,
  icm4: 16,
  icm8: 16,
  // s => 16 x 16
  "ics#": 16,
  ics4: 16,
  ics8: 16,
  is32: 16,
  s8mk: 16,
  icp4: 16,
  // l => 32 x 32
  icl4: 32,
  icl8: 32,
  il32: 32,
  l8mk: 32,
  icp5: 32,
  ic11: 32,
  // h => 48 x 48
  ich4: 48,
  ich8: 48,
  ih32: 48,
  h8mk: 48,
  // . => 64 x 64
  icp6: 64,
  ic12: 32,
  // t => 128 x 128
  it32: 128,
  t8mk: 128,
  ic07: 128,
  // . => 256 x 256
  ic08: 256,
  ic13: 256,
  // . => 512 x 512
  ic09: 512,
  ic14: 512,
  // . => 1024 x 1024
  ic10: 1024
};
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  return [
    toUTF8String(input, imageOffset, imageLengthOffset),
    readUInt32BE(input, imageLengthOffset)
  ];
}
function getImageSize(type) {
  const size = ICON_TYPE_SIZE[type];
  return { width: size, height: size, type };
}
const ICNS = {
  validate: (input) => toUTF8String(input, 0, 4) === "icns",
  calculate(input) {
    const inputLength = input.length;
    const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
    let imageOffset = SIZE_HEADER;
    let imageHeader = readImageHeader(input, imageOffset);
    let imageSize = getImageSize(imageHeader[0]);
    imageOffset += imageHeader[1];
    if (imageOffset === fileLength) return imageSize;
    const result = {
      height: imageSize.height,
      images: [imageSize],
      width: imageSize.width
    };
    while (imageOffset < fileLength && imageOffset < inputLength) {
      imageHeader = readImageHeader(input, imageOffset);
      imageSize = getImageSize(imageHeader[0]);
      imageOffset += imageHeader[1];
      result.images.push(imageSize);
    }
    return result;
  }
};

const J2C = {
  // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
  validate: (input) => toHexString(input, 0, 4) === "ff4fff51",
  calculate: (input) => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8)
  })
};

const JP2 = {
  validate(input) {
    if (readUInt32BE(input, 4) !== 1783636e3 || readUInt32BE(input, 0) < 1) return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    return readUInt32BE(input, ftypBox.offset + 4) === 1718909296;
  },
  calculate(input) {
    const jp2hBox = findBox(input, "jp2h", 0);
    const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
    if (ihdrBox) {
      return {
        height: readUInt32BE(input, ihdrBox.offset + 8),
        width: readUInt32BE(input, ihdrBox.offset + 12)
      };
    }
    throw new TypeError("Unsupported JPEG 2000 format");
  }
};

const EXIF_MARKER = "45786966";
const APP1_DATA_SIZE_BYTES = 2;
const EXIF_HEADER_BYTES = 6;
const TIFF_BYTE_ALIGN_BYTES = 2;
const BIG_ENDIAN_BYTE_ALIGN = "4d4d";
const LITTLE_ENDIAN_BYTE_ALIGN = "4949";
const IDF_ENTRY_BYTES = 12;
const NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfOffset = 8;
  const offset = EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;
    if (start > exifBlock.length) {
      return;
    }
    const block = exifBlock.slice(start, end);
    const tagNumber = readUInt(block, 16, 0, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt(block, 16, 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt(block, 32, 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt(block, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(
    exifBlock,
    EXIF_HEADER_BYTES,
    EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES
  );
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(exifBlock, isBigEndian);
  }
}
function validateInput(input, index) {
  if (index > input.length) {
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
}
const JPG = {
  validate: (input) => toHexString(input, 0, 2) === "ffd8",
  calculate(input) {
    input = input.slice(4);
    let orientation;
    let next;
    while (input.length) {
      const i = readUInt16BE(input, 0);
      if (input[i] !== 255) {
        input = input.slice(1);
        continue;
      }
      if (isEXIF(input)) {
        orientation = validateExifBlock(input, i);
      }
      validateInput(input, i);
      next = input[i + 1];
      if (next === 192 || next === 193 || next === 194) {
        const size = extractSize(input, i + 5);
        if (!orientation) {
          return size;
        }
        return {
          height: size.height,
          orientation,
          width: size.width
        };
      }
      input = input.slice(i + 2);
    }
    throw new TypeError("Invalid JPG, no size found");
  }
};

const KTX = {
  validate: (input) => {
    const signature = toUTF8String(input, 1, 7);
    return ["KTX 11", "KTX 20"].includes(signature);
  },
  calculate: (input) => {
    const type = input[5] === 49 ? "ktx" : "ktx2";
    const offset = type === "ktx" ? 36 : 20;
    return {
      height: readUInt32LE(input, offset + 4),
      width: readUInt32LE(input, offset),
      type
    };
  }
};

const pngSignature = "PNG\r\n\n";
const pngImageHeaderChunkName = "IHDR";
const pngFriedChunkName = "CgBI";
const PNG = {
  validate(input) {
    if (pngSignature === toUTF8String(input, 1, 8)) {
      let chunkName = toUTF8String(input, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toUTF8String(input, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError("Invalid PNG");
      }
      return true;
    }
    return false;
  },
  calculate(input) {
    if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(input, 36),
        width: readUInt32BE(input, 32)
      };
    }
    return {
      height: readUInt32BE(input, 20),
      width: readUInt32BE(input, 16)
    };
  }
};

const PNMTypes = {
  P1: "pbm/ascii",
  P2: "pgm/ascii",
  P3: "ppm/ascii",
  P4: "pbm",
  P5: "pgm",
  P6: "ppm",
  P7: "pam",
  PF: "pfm"
};
const handlers = {
  default: (lines) => {
    let dimensions = [];
    while (lines.length > 0) {
      const line = lines.shift();
      if (line[0] === "#") {
        continue;
      }
      dimensions = line.split(" ");
      break;
    }
    if (dimensions.length === 2) {
      return {
        height: parseInt(dimensions[1], 10),
        width: parseInt(dimensions[0], 10)
      };
    } else {
      throw new TypeError("Invalid PNM");
    }
  },
  pam: (lines) => {
    const size = {};
    while (lines.length > 0) {
      const line = lines.shift();
      if (line.length > 16 || line.charCodeAt(0) > 128) {
        continue;
      }
      const [key, value] = line.split(" ");
      if (key && value) {
        size[key.toLowerCase()] = parseInt(value, 10);
      }
      if (size.height && size.width) {
        break;
      }
    }
    if (size.height && size.width) {
      return {
        height: size.height,
        width: size.width
      };
    } else {
      throw new TypeError("Invalid PAM");
    }
  }
};
const PNM = {
  validate: (input) => toUTF8String(input, 0, 2) in PNMTypes,
  calculate(input) {
    const signature = toUTF8String(input, 0, 2);
    const type = PNMTypes[signature];
    const lines = toUTF8String(input, 3).split(/[\r\n]+/);
    const handler = handlers[type] || handlers.default;
    return handler(lines);
  }
};

const PSD = {
  validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
  calculate: (input) => ({
    height: readUInt32BE(input, 14),
    width: readUInt32BE(input, 18)
  })
};

const svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
const extractorRegExps = {
  height: /\sheight=(['"])([^%]+?)\1/,
  root: svgReg,
  viewbox: /\sviewBox=(['"])(.+?)\1/i,
  width: /\swidth=(['"])([^%]+?)\1/
};
const INCH_CM = 2.54;
const units = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: 96 / INCH_CM * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1
};
const unitsReg = new RegExp(
  `^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`
);
function parseLength(len) {
  const m = unitsReg.exec(len);
  if (!m) {
    return void 0;
  }
  return Math.round(Number(m[1]) * (units[m[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root) {
  const width = root.match(extractorRegExps.width);
  const height = root.match(extractorRegExps.height);
  const viewbox = root.match(extractorRegExps.viewbox);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width
    };
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
const SVG = {
  // Scan only the first kilo-byte to speed up the check on larger files
  validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
  calculate(input) {
    const root = toUTF8String(input).match(extractorRegExps.root);
    if (root) {
      const attrs = parseAttributes(root[0]);
      if (attrs.width && attrs.height) {
        return calculateByDimensions(attrs);
      }
      if (attrs.viewbox) {
        return calculateByViewbox(attrs, attrs.viewbox);
      }
    }
    throw new TypeError("Invalid SVG");
  }
};

const TGA = {
  validate(input) {
    return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
  },
  calculate(input) {
    return {
      height: readUInt16LE(input, 14),
      width: readUInt16LE(input, 12)
    };
  }
};

function readIFD(input, isBigEndian) {
  const ifdOffset = readUInt(input, 32, 4, isBigEndian);
  return input.slice(ifdOffset + 2);
}
function readValue(input, isBigEndian) {
  const low = readUInt(input, 16, 8, isBigEndian);
  const high = readUInt(input, 16, 10, isBigEndian);
  return (high << 16) + low;
}
function nextTag(input) {
  if (input.length > 24) {
    return input.slice(12);
  }
}
function extractTags(input, isBigEndian) {
  const tags = {};
  let temp = input;
  while (temp && temp.length) {
    const code = readUInt(temp, 16, 0, isBigEndian);
    const type = readUInt(temp, 16, 2, isBigEndian);
    const length = readUInt(temp, 32, 4, isBigEndian);
    if (code === 0) {
      break;
    } else {
      if (length === 1 && (type === 3 || type === 4)) {
        tags[code] = readValue(temp, isBigEndian);
      }
      temp = nextTag(temp);
    }
  }
  return tags;
}
function determineEndianness(input) {
  const signature = toUTF8String(input, 0, 2);
  if ("II" === signature) {
    return "LE";
  } else if ("MM" === signature) {
    return "BE";
  }
}
const signatures = [
  // '492049', // currently not supported
  "49492a00",
  // Little endian
  "4d4d002a"
  // Big Endian
  // '4d4d002a', // BigTIFF > 4GB. currently not supported
];
const TIFF = {
  validate: (input) => signatures.includes(toHexString(input, 0, 4)),
  calculate(input) {
    const isBigEndian = determineEndianness(input) === "BE";
    const ifdBuffer = readIFD(input, isBigEndian);
    const tags = extractTags(ifdBuffer, isBigEndian);
    const width = tags[256];
    const height = tags[257];
    if (!width || !height) {
      throw new TypeError("Invalid Tiff. Missing tags");
    }
    return { height, width };
  }
};

function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
const WEBP = {
  validate(input) {
    const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
    const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
    const vp8Header = "VP8" === toUTF8String(input, 12, 15);
    return riffHeader && webpHeader && vp8Header;
  },
  calculate(input) {
    const chunkHeader = toUTF8String(input, 12, 16);
    input = input.slice(20, 30);
    if (chunkHeader === "VP8X") {
      const extendedHeader = input[0];
      const validStart = (extendedHeader & 192) === 0;
      const validEnd = (extendedHeader & 1) === 0;
      if (validStart && validEnd) {
        return calculateExtended(input);
      } else {
        throw new TypeError("Invalid WebP");
      }
    }
    if (chunkHeader === "VP8 " && input[0] !== 47) {
      return calculateLossy(input);
    }
    const signature = toHexString(input, 3, 6);
    if (chunkHeader === "VP8L" && signature !== "9d012a") {
      return calculateLossless(input);
    }
    throw new TypeError("Invalid WebP");
  }
};

const typeHandlers = /* @__PURE__ */ new Map([
  ["bmp", BMP],
  ["cur", CUR],
  ["dds", DDS],
  ["gif", GIF],
  ["heif", HEIF],
  ["icns", ICNS],
  ["ico", ICO],
  ["j2c", J2C],
  ["jp2", JP2],
  ["jpg", JPG],
  ["ktx", KTX],
  ["png", PNG],
  ["pnm", PNM],
  ["psd", PSD],
  ["svg", SVG],
  ["tga", TGA],
  ["tiff", TIFF],
  ["webp", WEBP]
]);
const types = Array.from(typeHandlers.keys());

const firstBytes = /* @__PURE__ */ new Map([
  [56, "psd"],
  [66, "bmp"],
  [68, "dds"],
  [71, "gif"],
  [73, "tiff"],
  [77, "tiff"],
  [82, "webp"],
  [105, "icns"],
  [137, "png"],
  [255, "jpg"]
]);
function detector(input) {
  const byte = input[0];
  const type = firstBytes.get(byte);
  if (type && typeHandlers.get(type).validate(input)) {
    return type;
  }
  return types.find((fileType) => typeHandlers.get(fileType).validate(input));
}

const globalOptions = {
  disabledTypes: []
};
function lookup(input) {
  const type = detector(input);
  if (typeof type !== "undefined") {
    if (globalOptions.disabledTypes.indexOf(type) > -1) {
      throw new TypeError("disabled file type: " + type);
    }
    const size = typeHandlers.get(type).calculate(input);
    if (size !== void 0) {
      size.type = size.type ?? type;
      return size;
    }
  }
  throw new TypeError("unsupported file type: " + type);
}

async function probe(url) {
  const response = await fetch(url);
  if (!response.body || !response.ok) {
    throw new Error("Failed to fetch image");
  }
  const reader = response.body.getReader();
  let done, value;
  let accumulatedChunks = new Uint8Array();
  while (!done) {
    const readResult = await reader.read();
    done = readResult.done;
    if (done) break;
    if (readResult.value) {
      value = readResult.value;
      let tmp = new Uint8Array(accumulatedChunks.length + value.length);
      tmp.set(accumulatedChunks, 0);
      tmp.set(value, accumulatedChunks.length);
      accumulatedChunks = tmp;
      try {
        const dimensions = lookup(accumulatedChunks);
        if (dimensions) {
          await reader.cancel();
          return dimensions;
        }
      } catch (error) {
      }
    }
  }
  throw new Error("Failed to parse the size");
}

async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await import(
      // @ts-expect-error
      '../astro/assets-service_CALzWIsc.mjs'
    ).then(n => n.k).catch((e) => {
      const error = new AstroError(InvalidImageService);
      error.cause = e;
      throw error;
    });
    if (!globalThis.astroAsset) globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig) {
  if (!options || typeof options !== "object") {
    throw new AstroError({
      ...ExpectedImageOptions,
      message: ExpectedImageOptions.message(JSON.stringify(options))
    });
  }
  if (typeof options.src === "undefined") {
    throw new AstroError({
      ...ExpectedImage,
      message: ExpectedImage.message(
        options.src,
        "undefined",
        JSON.stringify(options)
      )
    });
  }
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: await resolveSrc(options.src)
  };
  if (options.inferSize && isRemoteImage(resolvedOptions.src)) {
    try {
      const result = await probe(resolvedOptions.src);
      resolvedOptions.width ??= result.width;
      resolvedOptions.height ??= result.height;
      delete resolvedOptions.inferSize;
    } catch {
      throw new AstroError({
        ...FailedToFetchRemoteImageDimensions,
        message: FailedToFetchRemoteImageDimensions.message(resolvedOptions.src)
      });
    }
  }
  const originalFilePath = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.fsPath : void 0;
  const clonedSrc = isESMImportedImage(resolvedOptions.src) ? (
    // @ts-expect-error - clone is a private, hidden prop
    resolvedOptions.src.clone ?? resolvedOptions.src
  ) : resolvedOptions.src;
  resolvedOptions.src = clonedSrc;
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig) : resolvedOptions;
  const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig) : [];
  let imageURL = await service.getURL(validatedOptions, imageConfig);
  let srcSets = await Promise.all(
    srcSetTransforms.map(async (srcSet) => ({
      transform: srcSet.transform,
      url: await service.getURL(srcSet.transform, imageConfig),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }))
  );
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && imageURL === validatedOptions.src)) {
    const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
    imageURL = globalThis.astroAsset.addStaticImage(
      validatedOptions,
      propsToHash,
      originalFilePath
    );
    srcSets = srcSetTransforms.map((srcSet) => ({
      transform: srcSet.transform,
      url: globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash, originalFilePath),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }));
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    src: imageURL,
    srcSet: {
      values: srcSets,
      attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
    },
    attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig) : {}
  };
}

const $$Astro$d = createAstro();
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  if (typeof props.width === "string") {
    props.width = parseInt(props.width);
  }
  if (typeof props.height === "string") {
    props.height = parseInt(props.height);
  }
  const image = await getImage(props);
  const additionalAttributes = {};
  if (image.srcSet.values.length > 0) {
    additionalAttributes.srcset = image.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(additionalAttributes)}${spreadAttributes(image.attributes)}>`;
}, "D:/demo/astro-db-first-look/node_modules/astro/components/Image.astro", void 0);

const $$Astro$c = createAstro();
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Picture;
  const defaultFormats = ["webp"];
  const defaultFallbackFormat = "png";
  const specialFormatsFallback = ["gif", "svg", "jpg", "jpeg"];
  const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  const scopedStyleClass = props.class?.match(/\bastro-\w{8}\b/)?.[0];
  if (scopedStyleClass) {
    if (pictureAttributes.class) {
      pictureAttributes.class = `${pictureAttributes.class} ${scopedStyleClass}`;
    } else {
      pictureAttributes.class = scopedStyleClass;
    }
  }
  for (const key in props) {
    if (key.startsWith("data-astro-cid")) {
      pictureAttributes[key] = props[key];
    }
  }
  const originalSrc = await resolveSrc(props.src);
  const optimizedImages = await Promise.all(
    formats.map(
      async (format) => await getImage({
        ...props,
        src: originalSrc,
        format,
        widths: props.widths,
        densities: props.densities
      })
    )
  );
  let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
  if (!fallbackFormat && isESMImportedImage(originalSrc) && specialFormatsFallback.includes(originalSrc.format)) {
    resultFallbackFormat = originalSrc.format;
  }
  const fallbackImage = await getImage({
    ...props,
    format: resultFallbackFormat,
    widths: props.widths,
    densities: props.densities
  });
  const imgAdditionalAttributes = {};
  const sourceAdditionalAttributes = {};
  if (props.sizes) {
    sourceAdditionalAttributes.sizes = props.sizes;
  }
  if (fallbackImage.srcSet.values.length > 0) {
    imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<picture${spreadAttributes(pictureAttributes)}> ${Object.entries(optimizedImages).map(([_, image]) => {
    const srcsetAttribute = props.densities || !props.densities && !props.widths ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
    return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute("image/" + image.options.format, "type")}${spreadAttributes(sourceAdditionalAttributes)}>`;
  })} <img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(imgAdditionalAttributes)}${spreadAttributes(fallbackImage.attributes)}> </picture>`;
}, "D:/demo/astro-db-first-look/node_modules/astro/components/Picture.astro", void 0);

const imageConfig = {"service":{"entrypoint":"astro/assets/services/sharp","config":{}},"domains":[],"remotePatterns":[]};
					const getImage = async (options) => await getImage$1(options, imageConfig);

const $$Astro$b = createAstro();
const $$Stock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Stock;
  const a = cva(
    "flex items-center gap-2 max-w-fit rounded transition-all shadow-xl shadow-black/60 hover:shadow-none",
    {
      variants: {
        intent: {
          primary: [
            "bg-theme-text",
            "text-theme-base",
            "border-transparent",
            "hover:bg-theme-text/90",
            "focus:outline-none",
            "focus-visible:ring-2",
            "ring-theme-text",
            "ring-offset-4",
            "ring-offset-theme-base"
          ],
          accent: [
            "bg-theme-accent",
            "border-transparent",
            "hover:bg-theme-accent/90",
            "focus:outline-none",
            "focus-visible:ring-2",
            "ring-theme-accent",
            "ring-offset-4",
            "ring-offset-theme-base"
          ]
        },
        size: {
          small: ["text-sm", "py-1", "px-2"],
          medium: ["text-base", "py-2", "px-4"],
          large: ["text-lg", "py-3", "px-5"]
        }
      }
    }
  );
  const { intent = "primary", size = "medium", ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(a({ intent, size }), "class:list")}${spreadAttributes(rest)}> ${renderSlot($$result, $$slots["default"])} </a>`;
}, "D:/demo/astro-db-first-look/src/components/ui/stock.astro", void 0);

const $$Astro$a = createAstro();
const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Button;
  const button = cva(
    "flex items-center gap-2 max-w-fit rounded transition-all focus:outline-none focus-visible:ring-2 ring-offset-4 border-transparent text-theme-base ring-offset-theme-base",
    {
      variants: {
        intent: {
          primary: ["bg-theme-text", "hover:bg-theme-text/90", "ring-theme-text"],
          accent: [
            "bg-theme-accent",
            "hover:bg-theme-accent/90",
            "ring-theme-accent"
          ]
        },
        size: {
          small: ["text-sm", "py-1", "px-2"],
          medium: ["text-base", "py-2", "px-4"],
          large: ["text-lg", "py-3", "px-5"],
          square: ["p-2", "aspect-square"]
        }
      }
    }
  );
  const { intent = "primary", size = "medium", classes, ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button${addAttribute(twMerge([button({ intent, size }), classes]), "class:list")}${spreadAttributes(rest)}> ${renderSlot($$result, $$slots["default"])} </button>`;
}, "D:/demo/astro-db-first-look/src/components/ui/Button.astro", void 0);

const icons = {"local":{"prefix":"local","lastModified":1717146623,"icons":{"check":{"body":"<g fill=\"none\" fill-rule=\"evenodd\"><path d=\"M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z\"/><path fill=\"currentColor\" d=\"M19.495 3.133a1 1 0 0 1 1.352.309l.99 1.51a1 1 0 0 1-.155 1.279l-.003.004-.014.013-.057.053-.225.215a83.86 83.86 0 0 0-3.62 3.736c-2.197 2.416-4.806 5.578-6.562 8.646-.49.856-1.687 1.04-2.397.301l-6.485-6.738a1 1 0 0 1 .051-1.436l1.96-1.768A1 1 0 0 1 5.6 9.2l3.309 2.481c5.169-5.097 8.1-7.053 10.586-8.548\"/></g>","width":24,"height":24},"trash":{"body":"<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687 4.032 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5z\" clip-rule=\"evenodd\"/>","width":15,"height":15}}}};

const cache = /* @__PURE__ */ new WeakMap();

const $$Astro$9 = createAstro();
const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Icon;
  class AstroIconError extends Error {
    constructor(message) {
      super(message);
    }
  }
  const req = Astro2.request;
  const { name = "", title, "is:inline": inline = false, ...props } = Astro2.props;
  const map = cache.get(req) ?? /* @__PURE__ */ new Map();
  const i = map.get(name) ?? 0;
  map.set(name, i + 1);
  cache.set(req, map);
  const includeSymbol = !inline && i === 0;
  let [setName, iconName] = name.split(":");
  if (!setName && iconName) {
    const err = new AstroIconError(`Invalid "name" provided!`);
    throw err;
  }
  if (!iconName) {
    iconName = setName;
    setName = "local";
    if (!icons[setName]) {
      const err = new AstroIconError('Unable to load the "local" icon set!');
      throw err;
    }
    if (!(iconName in icons[setName].icons)) {
      const err = new AstroIconError(`Unable to locate "${name}" icon!`);
      throw err;
    }
  }
  const collection = icons[setName];
  if (!collection) {
    const err = new AstroIconError(`Unable to locate the "${setName}" icon set!`);
    throw err;
  }
  const iconData = getIconData(collection, iconName ?? setName);
  if (!iconData) {
    const err = new AstroIconError(`Unable to locate "${name}" icon!`);
    throw err;
  }
  const id = `ai:${collection.prefix}:${iconName ?? setName}`;
  if (props.size) {
    props.width = props.size;
    props.height = props.size;
    delete props.size;
  }
  const renderData = iconToSVG(iconData);
  const normalizedProps = { ...renderData.attributes, ...props };
  const normalizedBody = renderData.body;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(normalizedProps)}${addAttribute(name, "data-icon")}> ${title && renderTemplate`<title>${title}</title>`} ${inline ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "id": id }, { "default": ($$result2) => renderTemplate`${unescapeHTML(normalizedBody)}` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${includeSymbol && renderTemplate`<symbol${addAttribute(id, "id")}>${unescapeHTML(normalizedBody)}</symbol>`}<use${addAttribute(`#${id}`, "xlink:href")}></use> ` })}`} </svg>`;
}, "D:/demo/astro-db-first-look/node_modules/astro-icon/components/Icon.astro", void 0);

const $$Astro$8 = createAstro();
const $$UpdateDiaglog = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$UpdateDiaglog;
  Astro2.props;
  return renderTemplate`${maybeRenderHead()}<dialog id="dialog2" style="background-color: rgb(60, 61, 63);width :30%;"> <div class=" text-theme-text shadow-xl rounded-md w-full max-w-x backdrop:bg-black/60"> <div class="p-4 sm:p-8 grid gap-6"> <form class="grid gap-4" id="update-form"> <h2 class="text-xl text-theme-accent font-bold leading-tight">修改库存</h2> <div class="grid gap-2"> <div class="flex items-center gap-2"> <label class="text-sm font-medium w-1/3">ID</label> <input type="number" name="id" class="w-2/3 p-2 border border-gray-300 rounded-md" readonly> </div> </div> <div class="grid gap-2"> <div class="flex items-center gap-2"> <label class="text-sm font-medium w-1/3">PN</label> <input type="text" name="partnumber" class="w-2/3 p-2 border border-gray-300 rounded-md"> </div> </div> <div class="grid gap-2"> <div class="flex items-center gap-2"> <label class="text-sm font-medium w-1/3">DS</label> <input type="text" name="description" class="w-2/3 p-2 border border-gray-300 rounded-md"> </div> </div> <div class="grid gap-2"> <div class="flex items-center gap-2"> <label class="text-sm font-medium w-1/3">QTY</label> <input type="number" name="qty" class="w-2/3 p-2 border border-gray-300 rounded-md"> </div> </div> <div class="grid gap-2"> <div class="flex items-center gap-2"> <label class="text-sm font-medium w-1/3">URL</label> <input type="text" name="url" class="w-2/3 p-2 border border-gray-300 rounded-md"> </div> </div> <div class="grid gap-2"> <div class="flex items-center gap-2"> <label class="text-sm font-medium w-1/3">SQTY</label> <input type="number" name="safeqty" class="w-2/3 p-2 border border-gray-300 rounded-md"> </div> </div> <div class="flex justify-end gap-4 mt-4"> <button type="button" class="px-4 py-2 bg-primary text-white rounded-md" id="close-dialog">Close</button> <button type="submit" class="px-4 py-2 bg-accent text-white rounded-md">Update</button> </div> </form> </div> </div> </dialog> `;
}, "D:/demo/astro-db-first-look/src/components/ui/UpdateDiaglog.astro", void 0);

const $$Astro$7 = createAstro();
const $$StockCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$StockCard;
  const { stock } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="p-4 sm:p-6 bg-theme-base text-theme-text shadow-black/60 shadow-xl rounded-md grid gap-6 relative"> <div class="grid gap-2"> <h2 class="leading-tight font-bold text-theme-accent text-xl text-balance"> ${stock.partnumber} </h2> <p>${stock.description}</p> <p>Onhand Qty : ${stock.qty} Safe Qty : ${stock.safeqty}</p> </div> ${renderComponent($$result, "Stock", $$Stock, { "href": stock.url, "intent": "primary" }, { "default": ($$result2) => renderTemplate`Open Link` })} ${renderComponent($$result, "Button", $$Button, { "intent": "accent", "size": "square", "data-delete": true, "data-id": stock.id, "classes": "absolute -top-2 -right-2 rounded-full border-4 border-theme-base hover:scale-105 active:scale-95 ring-offset-2", "aria-label": `Delete Link: ${stock.partnumber}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Icon", $$Icon, { "name": "trash", "size": 24 })} ` })} ${renderComponent($$result, "Button", $$Button, { "intent": "accent", "size": "square", "data-update": true, "data-id": stock.id, "data-partnumber": stock.partnumber, "data-description": stock.description, "data-qty": stock.qty, "data-url": stock.url, "data-safeqty": stock.safeqty, "classes": "absolute -right-1 -bottom-1 border-4 border-theme-base hover:scale-105 active:scale-95 ring-offset-2", "aria-label": `Update Link: ${stock.partnumber}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Icon", $$Icon, { "name": "check", "size": 24 })} ` })} ${renderComponent($$result, "UpdateDiaglog", $$UpdateDiaglog, { "stock": null })} </article> `;
}, "D:/demo/astro-db-first-look/src/components/ui/StockCard.astro", void 0);

const dots = new Proxy({"src":"/_astro/dots.B3Rppea-.png","width":14,"height":14,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "D:/demo/astro-db-first-look/src/assets/dots.png";
							}
							
							return target[name];
						}
					});

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-theme-base text-sm"> <div class="container grid place-items-center p-2"> <p>Copyright &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Dev Links</p> </div> </footer>`;
}, "D:/demo/astro-db-first-look/src/components/Footer.astro", void 0);

const $$Astro$6 = createAstro();
const $$TextArea = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$TextArea;
  const { id, name } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="relative grid gap-1"> <label${addAttribute(`input-${id}`, "for")} class="text-sm uppercase">${name}</label> <textarea required${addAttribute(`input-${id}`, "id")}${addAttribute(name.toLowerCase().replace(" ", "-"), "name")} class="p-2 bg-theme-text text-theme-base rounded focus:outline-none focus-visible:ring-2 ring-offset-4 ring-offset-theme-base ring-theme-accent"></textarea> </div>`;
}, "D:/demo/astro-db-first-look/src/components/ui/TextArea.astro", void 0);

const $$Astro$5 = createAstro();
const $$TextInput = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$TextInput;
  const { inputId, name, ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="relative grid gap-1"> <label${addAttribute(`input-${inputId}`, "for")} class="text-sm uppercase">${name}</label> <input type="text"${addAttribute(`input-${inputId}`, "id")}${spreadAttributes(rest)}${addAttribute(name.toLowerCase().replace(" ", "-"), "name")} class="p-2 bg-theme-text text-theme-base rounded focus:outline-none focus-visible:ring-2 ring-offset-4 ring-offset-theme-base ring-theme-accent" placeholder="Enter a search term…"> </div>`;
}, "D:/demo/astro-db-first-look/src/components/ui/TextInput.astro", void 0);

const $$Astro$4 = createAstro();
const $$NumberInput = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$NumberInput;
  const { inputId, name, ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="relative grid gap-1"> <label${addAttribute(`input-${inputId}`, "for")} class="text-sm uppercase">${name}</label> <input type="number" required${addAttribute(`input-${inputId}`, "id")}${spreadAttributes(rest)}${addAttribute(name.toLowerCase().replace(" ", "-"), "name")} class="p-2 bg-theme-text text-theme-base rounded focus:outline-none focus-visible:ring-2 ring-offset-4 ring-offset-theme-base ring-theme-accent"> </div>`;
}, "D:/demo/astro-db-first-look/src/components/ui/NumberInput.astro", void 0);

const $$Dialog2Stock = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<dialog id="dialog1" style="background-color: rgb(60, 61, 63);width :30%;"> <div class="p-4 sm:p-8 grid gap-6"> <form class="grid gap-4" id="add-form"> <h2 class="text-xl text-theme-accent font-bold leading-tight">
增加库存
</h2> ${renderComponent($$result, "TextInput", $$TextInput, { "name": "Part Number", "inputId": Math.random() })} ${renderComponent($$result, "TextArea", $$TextArea, { "name": "Link Description", "id": Math.random() })} ${renderComponent($$result, "NumberInput", $$NumberInput, { "name": "Qty input", "inputId": Math.random() })} ${renderComponent($$result, "TextInput", $$TextInput, { "name": "Link URL", "inputId": Math.random(), "title": "Must start with https://", "pattern": "https?://.*" })} ${renderComponent($$result, "NumberInput", $$NumberInput, { "name": "SafeQTY input", "inputId": Math.random() })} <!-- <Checkbox checked={false} inputId={Math.random()} name="isRead" /> --> <div class="flex gap-4 flex-wrap"> ${renderComponent($$result, "Button", $$Button, { "intent": "primary", "id": "close-dialog1", "type": "button" }, { "default": ($$result2) => renderTemplate`Close` })} ${renderComponent($$result, "Button", $$Button, { "intent": "accent", "type": "submit" }, { "default": ($$result2) => renderTemplate`Add Link` })} </div> </form> </div> </dialog> `;
}, "D:/demo/astro-db-first-look/src/components/ui/Dialog2stock.astro", void 0);

const $$Astro$3 = createAstro();
const $$Uploadgooglesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Uploadgooglesheet;
  return renderTemplate`${maybeRenderHead()}<dialog id="uploaddialog" style="background-color: rgb(60, 61, 63);width :30%;"> <div class="text-theme-text shadow-xl rounded-md w-full max-w-x backdrop:bg-black/60" style="background-color: rgb(39, 41, 43);"> <div class="p-4 sm:p-8 grid gap-6"> <form class="grid gap-4" id="upload-form" enctype="multipart/form-data"> <h2 class="text-xl text-theme-accent font-bold leading-tight">上传Excel文件</h2> <div class="grid gap-2"> <div class="flex items-center gap-2"> <label class="text-sm font-medium w-1/3">选择文件</label> <input type="file" name="excelFile" accept=".xlsx, .xls" class="w-2/3 p-2 border border-gray-300 rounded-md"> </div> <div class="flex items-center gap-2"> <label class="text-sm font-medium w-1/3">选择Opensheet</label> <input type="text" name="opensheetstring" class="w-2/3 p-2 border border-gray-300 rounded-md"> </div> </div> <div class="flex justify-end gap-4 mt-4"> <button type="button" class="px-4 py-2 bg-primary text-white rounded-md" id="close-upload-dialog">Close</button> <button type="submit" class="px-4 py-2 bg-accent text-white rounded-md">Upload</button> </div> </form> </div> </div> </dialog> `;
}, "D:/demo/astro-db-first-look/src/components/ui/Uploadgooglesheet.astro", void 0);

const $$Search2Data = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<dialog id="dialog3" style="background-color: rgb(60, 61, 63);width :30%;"> <div class="p-4 sm:p-8 grid gap-6"> <form class="grid gap-4" id="search-form"> <h2 class="text-xl text-theme-accent font-bold leading-tight">
搜索库存
</h2> ${renderComponent($$result, "TextInput", $$TextInput, { "name": "Part Numbers", "inputId": Math.random() })} ${renderComponent($$result, "TextInput", $$TextInput, { "name": "Link Descriptions", "inputId": Math.random() })} <div class="flex gap-4 flex-wrap"> ${renderComponent($$result, "Button", $$Button, { "intent": "primary", "id": "close-dialog3", "type": "button" }, { "default": ($$result2) => renderTemplate`Close` })} ${renderComponent($$result, "Button", $$Button, { "intent": "accent", "type": "submit" }, { "default": ($$result2) => renderTemplate`Search` })} </div> </form> </div> <!-- <main >
    <aside class="form" >
      <div>
        <label for="search">Search the Blog</label>
        <span>Enter a search term or phrase to search the blog.</span>
      </div>
      <input 
        type="search"
        required
        min="2"
        max="24"
        name="search"
        id="search"
        placeholder="Enter a search term…"
      />
    </div>
    <p id="searchReadout"></p>
    <section aria-label="Search Results">
      <ul id="searchResults"></ul>
    </section>
  </main> --> </dialog> `;
}, "D:/demo/astro-db-first-look/src/components/ui/Search2data.astro", void 0);

const $$Astro$2 = createAstro();
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const dotsImage = await getImage({ src: dots, format: "avif" });
  const { title = "\u8BA2\u5355\u7BA1\u7406", description = "Links for web developers." } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="msapplication-TileColor" content="#F46633"><meta name="theme-color" content="#202020"><meta name="color-scheme" content="dark"><title>${title}</title><meta name="description"${addAttribute(description, "content")}>${renderHead()}</head> <body class="bg-gradient-to-b from-black to-theme-base text-theme-text text-base relative"> <div${addAttribute(`background-image: url(${dotsImage.src}); -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))`, "style")} class="absolute left-0 h-60 right-0 opacity-40 mix-blend-difference -z-10"></div> <div class="grid gap-10 sm:gap-16 min-h-screen grid-rows-auto_1fr_auto relative overflow-hidden"> <header class="grid place-items-center py-8"> <h1 class="text-theme-accent font-bold text-4xl [text-shadow:_0_10px_15px_black]">
库存管理系统
</h1> <div class="flex space-x-4"> ${renderComponent($$result, "Button", $$Button, { "intent": "accent", "id": "open-dialog" }, { "default": ($$result2) => renderTemplate`增加订单` })} ${renderComponent($$result, "Button", $$Button, { "intent": "accent", "id": "upload-dialog" }, { "default": ($$result2) => renderTemplate`批量上传` })} ${renderComponent($$result, "Button", $$Button, { "intent": "accent", "id": "search-dialog" }, { "default": ($$result2) => renderTemplate`搜索数据库` })} </div> </header> <main class="container after:absolute after:bg-theme-accent after:w-3/4 after:left-1/2 after:-translate-x-1/2 after:h-96 after:mix-blend-difference after:rounded-full after:-bottom-1/4 after:-z-50 after:blur-3xl after:opacity-40"> ${renderSlot($$result, $$slots["default"])} <br> <br> ${renderComponent($$result, "Footer", $$Footer, {})} ${renderComponent($$result, "Dialog2Stock", $$Dialog2Stock, {})} ${renderComponent($$result, "Uploadexcel", $$Uploadgooglesheet, {})} ${renderComponent($$result, "Search2Data", $$Search2Data, {})} ${renderComponent($$result, "UpdateDiaglog", $$UpdateDiaglog, {})} </main> </div> <div${addAttribute(`background-image: url(${dotsImage.src}); -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, to(rgba(0,0,0,1)), from(rgba(0,0,0,0)))`, "style")} class="absolute left-0 h-60 bottom-0 right-0 opacity-30 mix-blend-difference -z-10"></div> </body></html>`;
}, "D:/demo/astro-db-first-look/src/layouts/BaseLayout.astro", void 0);

const $$Astro$1 = createAstro();
const $$StockTable = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$StockTable;
  const { stocks } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<table class="min-w-full "> <thead> <tr> <th class="py-2">Part Number</th> <th class="py-2">Description</th> <th class="py-2">Onhand Qty</th> <th class="py-2">Safe Qty</th> <th class="py-2">URL</th> <th class="py-2">Actions</th> </tr> </thead> <tbody> ${stocks.map((stock) => renderTemplate`<tr${addAttribute(stock.id, "key")} class="border-t"> <th class="py-2">${stock.partnumber}</th> <th class="py-2">${stock.description}</th> <th class="py-2">${stock.qty}</th> <th class="py-2">${stock.safeqty}</th> <th class="py-2"> <a${addAttribute(stock.url, "href")} class="text-blue-500 hover:underline mr-4">
Open Link
</a> </th> <th> <button class="text-red-500 hover:text-red-700" open-dialog${addAttribute(stock.id, "data-id")}${addAttribute(`Update Link: ${stock.partnumber}`, "aria-label")}> ${renderComponent($$result, "Icon", $$Icon, { "name": "check", "size": 24 })} </button> <button class="text-red-500 hover:text-red-700" data-delete${addAttribute(stock.id, "data-id")}${addAttribute(`Delete Link: ${stock.partnumber}`, "aria-label")}> ${renderComponent($$result, "Icon", $$Icon, { "name": "trash", "size": 24 })} </button> </th> </tr>`)} </tbody> </table> <!-- <UpdateDiaglog stock={null} /> --> `;
}, "D:/demo/astro-db-first-look/src/components/ui/stockTable.astro", void 0);

const $$Astro = createAstro();
const $$Datas = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Datas;
  Astro2.props;
  const defaultStocks = await db.select().from(Stockonhand);
  const Stocks = defaultStocks;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="grid gap-6 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] items-start"> ${Stocks.map((item) => renderTemplate`${renderComponent($$result2, "StockCard", $$StockCard, { "stock": item })}`)} </div> <br> ${renderComponent($$result2, "StockTable", $$StockTable, { "stocks": Stocks })} ` })}`;
}, "D:/demo/astro-db-first-look/src/pages/datas.astro", void 0);

const $$file = "D:/demo/astro-db-first-look/src/pages/datas.astro";
const $$url = "/datas";

const datas = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Datas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Icon as $, $$Button as a, $$BaseLayout as b, datas as d, getConfiguredImageService as g, imageConfig as i };
