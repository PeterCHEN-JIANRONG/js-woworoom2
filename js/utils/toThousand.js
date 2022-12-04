// toThousand
// 每3位數加入逗號
export function toThousand(num) {
  let temp = num.toString().split(".");
  temp[0] = temp[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return temp.join(".");
}
