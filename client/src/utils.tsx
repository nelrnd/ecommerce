export function formatPrice(price) {
  let [int, dec] = price.toString().split(".")
  int = int
    .split("")
    .reverse()
    .map((nb, id) => (id % 3 == 0 && id != 0 ? nb + "," : nb))
    .reverse()
    .join("")
  dec = (dec || "0").slice(0, 2).padEnd(2, 0)
  return "$" + int + "." + dec
}
