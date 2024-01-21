import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Cart() {
  return (
    <Sheet>
      <SheetTrigger>Cart</SheetTrigger>
      <SheetContent className="w-[24rem]">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
