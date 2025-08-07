"use client";
import { MobileCategoryNavigator } from "@/components/mobile-category-navigator";

interface MobileCatalogOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileCatalogOverlay({
  isOpen,
  onClose,
}: MobileCatalogOverlayProps) {
  return <MobileCategoryNavigator isOpen={isOpen} onClose={onClose} />;
}
