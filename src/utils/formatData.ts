import { BigNumber as EthersBigNumber } from "@ethersproject/bignumber";
import BigNumber from "bignumber.js";
import { formatUnits } from "@ethersproject/units";

// div
export function formatAmount(balance: any, decimal = 18) {
  const balanceBN = new BigNumber(balance, 10);
  balance = balanceBN.toString(10);
  const wholeStr = balance.substring(0, balance.length - decimal) || "0";
  const fractionStr = balance
    .substring(balance.length - decimal)
    .padStart(decimal, "0")
    .substring(0, decimal);

  return trimTrailingZeroes(`${wholeStr}.${fractionStr}`);
}
// add
export function parseAmount(amount = "1", decimal = 18) {
  if (!amount) return "0";

  amount = cleanupAmount(amount);

  const split = amount.split(".");
  const wholePart = split[0];
  const fracPart = split[1] || "";
  if (split.length > 2 || fracPart.length > decimal) {
    throw new Error(`Cannot parse '${amount}' as bignumber`);
  }
  return trimLeadingZeroes(wholePart + fracPart.padEnd(decimal, "0"));
}
export const toHex = (num: any) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

// add 10%
export function calculateGasMargin(value: EthersBigNumber): EthersBigNumber {
  return value.mul(EthersBigNumber.from(10000).add(EthersBigNumber.from(1000))).div(EthersBigNumber.from(10000));
}

export function trimTrailingZeroes(value: any) {
  return value.replace(/\.?0*$/, "");
}
export function cleanupAmount(amount: any) {
  return amount.replace(/,/g, "").trim();
}

export function trimLeadingZeroes(value: any) {
  value = value.replace(/^0+/, "");
  if (value === "") {
    return "0";
  }
  return value;
}

//中间省略
//截取字符串中间用省略号显示
export function getSubStr(str: string) {
  var subStr1 = str.substr(0, 10);
  var subStr2 = str.substr(str.length - 5, 5);
  var subStr = subStr1 + "..." + subStr2;
  return subStr;
}

export const formatHexNumber = (number: EthersBigNumber, displayDecimals = 18, decimals = 18) => {
  const remainder = number.mod(EthersBigNumber.from(10).pow(decimals - displayDecimals));

  return formatUnits(number.sub(remainder), "0");
};

//时间戳转时间
export enum FormatsEnums {
  YMD = "Y-m-d",
  YMDHIS = "Y-m-d H:i:s",
  _YMD = "Y年m月d日",
  _YMDHIS = "Y年m月d日 H时i分",
}

export const dateFormat = function (timestamp: any, formats: FormatsEnums): string {
  console.log(typeof timestamp);

  // formats格式包括
  // 1. Y-m-d
  // 2. Y-m-d H:i:s
  // 3. Y年m月d日
  // 4. Y年m月d日 H时i分
  // formats = formats;

  const zero = function (value: number): string | number {
    if (value < 10) {
      return "0" + value;
    }
    return value;
  };

  const myDate = timestamp ? new Date(timestamp) : new Date();

  const year = myDate.getFullYear();
  const month = zero(myDate.getMonth() + 1);
  const day = zero(myDate.getDate());

  const hour = zero(myDate.getHours());
  const minite = zero(myDate.getMinutes());
  const second = zero(myDate.getSeconds());

  return formats.replace(/Y|m|d|H|i|s/gi, function (matches: string): any {
    return {
      Y: year,
      m: month,
      d: day,
      H: hour,
      i: minite,
      s: second,
    }[matches];
  });
};
