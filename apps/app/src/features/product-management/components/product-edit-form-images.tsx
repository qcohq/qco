"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@qco/ui/components/dialog";
import { Progress } from "@qco/ui/components/progress";
import { cn } from "@qco/ui/lib/utils";
import type { ProductImage } from "@qco/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  GripVertical,
  ImagePlus,
  Loader2,
  RotateCcw as ResetIcon,
  RotateCcw,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { useTRPC } from "~/trpc/react";

interface UploadingImage {
  id: string;
  file: File;
  progress: number;
  preview: string;
  error?: string;
}

interface ImagesProps {
  initialImages?: ProductImage[];
  productId?: string;
  onChange?: (images: ProductImage[]) => void;
}

// Создаем компонент для сортируемого элемента
function SortableImage({
  image,
  index,
  onRemove,
  onSetMain,
  onPreview,
}: {
  image: ProductImage;
  index: number;
  onRemove: (idx: number) => void;
  onSetMain: (idx: number) => void;
  onPreview: (image: ProductImage) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id || index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPreview(image);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(index);
  };

  const handleSetMainClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSetMain(index);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square rounded-lg border border-gray-200 overflow-hidden",
        isDragging && "shadow-lg scale-105",
      )}
    >
      {/* Drag handle - иконка с тремя точками */}
      <div
        className={cn(
          "absolute top-2 left-2 z-20 bg-white/90 backdrop-blur-sm rounded-md p-1 cursor-grab active:cursor-grabbing transition-all duration-150 shadow-sm",
          isDragging
            ? "scale-110 bg-white shadow-md"
            : "opacity-0 group-hover:opacity-100 hover:scale-105",
        )}
        {...attributes}
        {...listeners}
        tabIndex={0}
        role="button"
        aria-label={`Перетащить изображение ${index + 1}`}
      >
        <GripVertical className="h-4 w-4 text-gray-600" />
      </div>

      {image.meta.url ? (
        <div className="relative h-full w-full">
          <Image
            src={image.meta.url}
            alt={`Изображение товара ${index + 1}`}
            width={400}
            height={400}
            className="h-full w-full object-cover cursor-pointer transition-transform group-hover:scale-105"
            onClick={handleImageClick}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-30 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 shadow-lg"
            onClick={handleRemoveClick}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : null}

      {image.type === "main" && (
        <Badge className="bg-primary absolute top-2 left-12 z-30 text-xs font-medium">
          Основное
        </Badge>
      )}

      {image.type !== "main" && (
        <div className="absolute inset-0 flex items-end justify-start p-2 rounded-lg bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
          <Button
            variant="secondary"
            size="sm"
            className="text-xs pointer-events-auto z-30 bg-white/90 hover:bg-white text-gray-900"
            onClick={handleSetMainClick}
          >
            Сделать основным
          </Button>
        </div>
      )}

      {/* Номер позиции */}
      <div className="absolute bottom-2 right-2 z-30 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {index + 1}
      </div>
    </div>
  );
}

export function ProductEditFormImages({
  initialImages,
  onChange,
  productId,
}: ImagesProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<ProductImage | null>(null);
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);

  // Используем внутреннее состояние для изображений
  const [uploadedImages, setUploadedImages] = useState<ProductImage[]>([]);

  // Инициализируем изображения при монтировании компонента
  useEffect(() => {
    if (initialImages?.length) {
      // Фильтруем дубликаты и сортируем изображения
      const uniqueImages = initialImages.reduce((acc, current) => {
        const isDuplicate = acc.find((img) => img.fileId === current.fileId);
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, [] as ProductImage[]);

      // Сортируем изображения: сначала основное, потом остальные
      const sortedImages = uniqueImages.sort((a, b) => {
        if (a.type === "main") return -1;
        if (b.type === "main") return 1;
        return 0;
      });

      setUploadedImages(sortedImages);
      setOriginalOrder(sortedImages);
    }
  }, [initialImages]);

  // Функция для обновления изображений
  const updateImages = useCallback(
    (newImages: ProductImage[]) => {
      setUploadedImages(newImages);
      if (onChange) {
        onChange(newImages);
      }
    },
    [onChange],
  );

  // Мутация для удаления изображения
  const deleteImageMutation = useMutation(
    trpc.products.deleteImage.mutationOptions({
      onSuccess: () => {
        // При успешном удалении изображения через API не нужно обновлять локальные данные
        if (productId) {
          void queryClient.invalidateQueries({
            queryKey: trpc.products.getById.queryKey({ id: productId }),
          });
        }
        toast.success("Изображение удалено");
      },
      onError: (error) => {
        toast.error(
          `Ошибка: ${error.message || "Не удалось удалить изображение"}`,
        );
      },
    }),
  );

  // Функция для удаления изображения
  const handleRemoveImage = (idx: number) => {
    const image = uploadedImages[idx];

    if (productId && image?.fileId) {
      // Если есть productId, удаляем через API
      deleteImageMutation.mutate({
        productId,
        fileId: image.fileId,
      });
    } else {
      // Иначе просто удаляем из локального состояния
      const newImages = [...uploadedImages];
      newImages.splice(idx, 1);
      updateImages(newImages);
    }
  };

  // Функция для удаления загружаемого изображения
  const handleRemoveUploadingImage = (id: string) => {
    setUploadingImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Функция для предпросмотра изображения
  const handlePreviewImage = (image: ProductImage) => {
    if (image) {
      setPreviewImage(image);
      setPreviewDialogOpen(true);
    }
  };

  // Мутация для получения presigned URL
  const createPresignedUrlMutation = useMutation(
    trpc.attachments.createPresignedUrl.mutationOptions(),
  );

  // Мутация для автосохранения изображения в базу
  const addImageMutation = useMutation(
    trpc.products.addImage.mutationOptions({
      onSuccess: () => {
        if (productId) {
          void queryClient.invalidateQueries({
            queryKey: trpc.products.getById.queryKey({ id: productId }),
          });
        }
      },
      onError: (error) => {
        toast.error(
          `Ошибка: ${error.message || "Не удалось сохранить изображение"}`,
        );
      },
    }),
  );

  // Функция для загрузки файла на S3 и автосохранения в базу
  const uploadFile = useCallback(
    async (file: File) => {
      const fileId = `${file.name}-${Date.now()}`;
      try {
        // Получаем presigned URL для загрузки
        const { url, key } = await createPresignedUrlMutation.mutateAsync({
          key: file.name,
          temporary: false,
        });
        // Загружаем файл на S3
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              setUploadingImages((prev) =>
                prev.map((img) =>
                  img.id === fileId
                    ? {
                        ...img,
                        progress: Math.round(
                          (event.loaded / event.total) * 100,
                        ),
                      }
                    : img,
                ),
              );
            }
          });
          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(
                new Error(`Ошибка сервера: ${xhr.status} ${xhr.statusText}`),
              );
            }
          });
          xhr.addEventListener("error", () => {
            reject(new Error("Сетевая ошибка при загрузке файла"));
          });
          xhr.addEventListener("timeout", () => {
            reject(new Error("Превышено время ожидания при загрузке файла"));
          });
          xhr.open("PUT", url);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
        // После успешной загрузки файла вызываем addImage
        if (!productId) {
          // Если нет productId, просто добавляем файл локально
          // Создаем URL для локального файла, чтобы можно было отобразить его
          const objectUrl = URL.createObjectURL(file);

          const newImage: ProductImage = {
            id: key,
            fileId: key,
            meta: {
              url: objectUrl, // Используем локальный URL для отображения
              name: file.name,
              mimeType: file.type,
              size: file.size,
            },
            type: "gallery",
            order: 0,
          };

          updateImages([...uploadedImages, newImage]);
          return;
        }
        const savedImage = await addImageMutation.mutateAsync({
          productId,
          file: {
            fileId: key,
            type: "gallery",
            meta: {
              name: file.name,
              mimeType: file.type,
              size: file.size,
            },
          },
        });
        // Убедимся, что у нас есть fileId, чтобы избежать ошибок типизации
        if (savedImage?.fileId) {
          const newImage: ProductImage = {
            id: savedImage.fileId,
            fileId: savedImage.fileId,
            type: "gallery",
            meta: {
              url: savedImage.meta?.url ?? "",
              name: savedImage.meta?.name ?? "",
              mimeType: savedImage.meta?.mimeType ?? "",
              size: savedImage.meta?.size ?? 0,
            },
          };

          updateImages([...uploadedImages, newImage]);
        }
      } catch (error) {
        setUploadingImages((prev) =>
          prev.map((img) =>
            img.id === fileId
              ? {
                  ...img,
                  error:
                    error instanceof Error ? error.message : "Ошибка загрузки",
                }
              : img,
          ),
        );
        toast.error("Ошибка загрузки файла", {
          description:
            error instanceof Error
              ? error.message
              : "Не удалось загрузить файл",
        });
        throw error;
      }
    },
    [
      createPresignedUrlMutation,
      productId,
      addImageMutation,
      updateImages,
      uploadedImages,
    ],
  );

  // Обработчик для Dropzone
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const newUploadingImages = acceptedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}`,
        file,
        progress: 0,
        preview: URL.createObjectURL(file),
      }));
      setUploadingImages((prev) => [...prev, ...newUploadingImages]);
      try {
        for (const img of newUploadingImages) {
          await uploadFile(img.file);
        }
        setUploadingImages([]);
        toast.success(`Успешно загружено ${acceptedFiles.length} файлов`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Ошибка загрузки файлов",
        );
      }
    },
    [uploadFile],
  );

  // Настройка Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    multiple: true,
    maxFiles: 10,
  });

  // Настройка сенсоров для drag-and-drop - оптимизировано для быстрого отклика
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 50, // Минимальная задержка для мгновенного отклика
        tolerance: 2, // Минимальное расстояние для точного перетаскивания
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Добавляем мутацию для обновления порядка изображений
  const updateImagesOrderMutation = useMutation(
    trpc.products.updateImagesOrder.mutationOptions({
      onSuccess: () => {
        if (productId) {
          void queryClient.invalidateQueries({
            queryKey: trpc.products.getById.queryKey({ id: productId }),
          });
        }
        toast.success("Порядок изображений обновлен");
      },
      onError: (error) => {
        toast.error(
          `Ошибка: ${error.message || "Не удалось обновить порядок изображений"}`,
        );
      },
    }),
  );

  // Состояние для отслеживания сохранения порядка
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Состояние для отслеживания предыдущего порядка (для отмены)
  const [previousOrder, setPreviousOrder] = useState<ProductImage[]>([]);

  // Убираем ненужные состояния для упрощения

  // Состояние для отслеживания исходного порядка
  const [originalOrder, setOriginalOrder] = useState<ProductImage[]>([]);

  // Функция для отмены последнего изменения порядка
  const handleUndoOrderChange = () => {
    if (previousOrder.length > 0) {
      updateImages(previousOrder);
      setPreviousOrder([]);

      if (productId) {
        setIsSavingOrder(true);
        updateImagesOrderMutation.mutate(
          {
            productId,
            images: previousOrder.map((image, index) => ({
              id: image.id,
              fileId: image.fileId,
              type: image.type,
              order: index,
            })),
          },
          {
            onSettled: () => {
              setIsSavingOrder(false);
            },
          },
        );
      }

      toast.success("Изменение отменено");
    }
  };

  // Функция для сброса к исходному порядку
  const handleResetOrder = () => {
    if (originalOrder.length > 0) {
      updateImages(originalOrder);
      setPreviousOrder([]);

      if (productId) {
        setIsSavingOrder(true);
        updateImagesOrderMutation.mutate(
          {
            productId,
            images: originalOrder.map((image, index) => ({
              id: image.id,
              fileId: image.fileId,
              type: image.type,
              order: index,
            })),
          },
          {
            onSettled: () => {
              setIsSavingOrder(false);
            },
          },
        );
      }

      toast.success("Порядок сброшен к исходному");
    }
  };

  // Упрощенный обработчик окончания перетаскивания для лучшей производительности
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = uploadedImages.findIndex((img) => img.id === active.id);
      const newIndex = uploadedImages.findIndex((img) => img.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      // Сохраняем предыдущий порядок для возможности отмены
      setPreviousOrder([...uploadedImages]);

      const newImages = arrayMove(uploadedImages, oldIndex, newIndex);

      // Оптимистично обновляем UI
      updateImages(newImages);

      // Если есть productId, сохраняем новый порядок в базе
      if (productId) {
        setIsSavingOrder(true);
        updateImagesOrderMutation.mutate(
          {
            productId,
            images: newImages.map((image, index) => ({
              id: image.id,
              fileId: image.fileId,
              type: image.type,
              order: index,
            })),
          },
          {
            onSettled: () => {
              setIsSavingOrder(false);
            },
          },
        );
      } else {
        toast.success("Порядок изображений изменен");
      }
    }
  };

  // Создаем мутацию для установки основного изображения
  const setMainImageMutationOptions =
    trpc.products.setMainImage.mutationOptions({
      onSuccess: () => {
        // Инвалидируем кэш запроса продукта
        if (productId) {
          void queryClient.invalidateQueries({
            queryKey: trpc.products.getById.queryKey({ id: productId }),
          });
        }

        toast.success("Основное изображение изменено");
      },
      onError: (error) => {
        toast.error(
          `Ошибка: ${error.message || "Не удалось установить основное изображение"}`,
        );
      },
    });

  const { mutate: setMainImage } = useMutation(setMainImageMutationOptions);

  // Функция для установки основного изображения
  const handleSetMainImage = (idx: number) => {
    const newImages = [...uploadedImages];

    // Сначала убираем type 'main' у всех изображений
    newImages.forEach((img) => {
      img.type = "gallery";
    });

    // Устанавливаем type 'main' для выбранного изображения
    if (newImages[idx]) {
      newImages[idx].type = "main";

      // Перемещаем главное изображение в начало массива
      const mainImage = newImages.splice(idx, 1)[0];
      if (mainImage) {
        newImages.unshift(mainImage);

        // Обновляем внутреннее состояние и родительский компонент
        updateImages(newImages);

        // Если есть ID продукта и fileId изображения, вызываем мутацию
        if (productId && mainImage?.fileId) {
          setMainImage({
            productId,
            fileId: mainImage.fileId,
          });
        } else {
          toast.success("Основное изображение изменено локально");
        }
      }
    }
  };

  return (
    <section id="images" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Изображения товара
          </h2>
          <p className="text-sm text-gray-500">
            Загрузите и настройте изображения для товара
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Область загрузки */}
        <div
          {...getRootProps()}
          className={cn(
            "rounded-lg border-2 border-dashed p-6 transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400",
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-center text-center">
            <ImagePlus className="text-gray-400 mb-3 h-12 w-12" />
            <p className="text-gray-600 text-sm">
              Перетащите изображения сюда или{" "}
              <Button
                variant="link"
                type="button"
                className="h-auto p-0 text-primary"
              >
                выберите файлы
              </Button>
            </p>
            <p className="text-gray-500 mt-2 text-xs">
              Поддерживаются форматы JPG, PNG, WEBP. Рекомендуемый размер:
              1000x1000px
            </p>
          </div>
        </div>

        {/* Загружаемые изображения */}
        {uploadingImages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">
              Загрузка изображений
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {uploadingImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square rounded-lg border border-gray-200"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={image.preview}
                      alt="Загрузка..."
                      fill
                      className="rounded-lg object-cover"
                    />

                    {/* Индикатор прогресса */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/50">
                      {image.error ? (
                        <div className="p-2 text-center">
                          <X className="text-red-400 mx-auto mb-1 h-6 w-6" />
                          <p className="text-xs text-white">{image.error}</p>
                        </div>
                      ) : (
                        <>
                          <Loader2 className="mb-1 h-6 w-6 animate-spin text-white" />
                          <Progress
                            value={image.progress}
                            className="mb-1 h-1 w-3/4"
                          />
                          <p className="text-xs text-white">
                            {image.progress}%
                          </p>
                        </>
                      )}
                    </div>

                    {/* Кнопка удаления */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => handleRemoveUploadingImage(image.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Сетка изображений */}
        {uploadedImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Загруженные изображения
                </h3>
                {isSavingOrder && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Сохранение...</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <GripVertical className="h-3 w-3 text-gray-400" />
                  <span>Перетащите за иконку для изменения порядка</span>
                </div>
                {previousOrder.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndoOrderChange}
                    disabled={isSavingOrder}
                    className="h-6 px-2 text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Отменить
                  </Button>
                )}
                {originalOrder.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetOrder}
                    disabled={isSavingOrder}
                    className="h-6 px-2 text-xs"
                  >
                    <ResetIcon className="h-3 w-3 mr-1" />
                    Сбросить
                  </Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={uploadedImages.map((img) => img.id || "")}
                  strategy={verticalListSortingStrategy}
                >
                  <AnimatePresence>
                    {uploadedImages.map((image, idx) => (
                      <motion.div
                        key={image.id || idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SortableImage
                          image={image}
                          index={idx}
                          onRemove={handleRemoveImage}
                          onSetMain={handleSetMainImage}
                          onPreview={handlePreviewImage}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}
      </div>

      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Предпросмотр изображения</DialogTitle>
          </DialogHeader>
          {previewImage?.meta.url ? (
            <div className="relative aspect-square w-full">
              <Image
                src={previewImage.meta.url}
                alt={"Предпросмотр изображения"}
                fill
                className="rounded-lg object-contain"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
