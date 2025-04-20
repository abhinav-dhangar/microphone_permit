import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ListeningLottie from "./lottieComp";

interface MicPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MicPopup({ open, onOpenChange }: MicPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[300px] lg:max-w-[425px] ">
        <ListeningLottie />

        <Button type="submit">Stop Listening</Button>
      </DialogContent>
    </Dialog>
  );
}
