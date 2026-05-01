import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImageOff, ImagePlus, Pencil, Plus, RefreshCcw, Trash2, UploadCloud } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { LoadingState } from '../../components/ui/LoadingState'
import { Reveal } from '../../components/ui/Reveal'
import { Textarea } from '../../components/ui/Textarea'
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct,
  type ProductPayload,
} from '../../services/productService'
import type { Product } from '../../types/product'

const productFormSchema = z.object({
  name: z.string().trim().min(2, 'Product name is required.'),
  slug: z.string().trim().optional(),
  category: z.string().trim().min(2, 'Category is required.'),
  price: z.number().min(1, 'Price must be greater than 0.'),
  battery: z.string().trim().min(2, 'Battery is required.'),
  range: z.string().trim().min(2, 'Range is required.'),
  topSpeed: z.string().trim().min(2, 'Top speed is required.'),
  chargingTime: z.string().trim().min(2, 'Charging time is required.'),
  colorsInput: z.string().trim().min(2, 'Add at least one color.'),
  shortDescription: z.string().trim().min(10, 'Short description is too short.'),
  description: z.string().trim().min(20, 'Description is too short.'),
  tag: z.string().trim().optional(),
  featured: z.boolean().default(false),
  specs: z.array(z.object({
    label: z.string().trim().min(1, 'Label is required.'),
    value: z.string().trim().min(1, 'Value is required.'),
  })).min(1, 'Add at least one specification.'),
})

type ProductFormValues = z.input<typeof productFormSchema>

const categoryOptions = ['Urban', 'Adventure', 'Cargo']
const docModels = ['EVOX', 'NEXO', 'Xplorer', 'Jaguar', 'Venturer']
const defaultSpecRows = [
  { label: 'Motor', value: '' },
  { label: 'Controller', value: '' },
  { label: 'Dimension', value: '' },
  { label: 'Ground Clearance', value: '' },
  { label: 'Charger', value: '' },
  { label: 'Tire', value: '' },
  { label: 'Braking System', value: '' },
  { label: 'Display', value: '' },
  { label: 'Net Weight', value: '' },
  { label: 'Loading Capacity', value: '' },
  { label: 'Shock Absorber', value: '' },
  { label: 'Features', value: '' },
]

function getDefaultValues(): ProductFormValues {
  return {
    name: '',
    slug: '',
    category: 'Urban',
    price: 0,
    battery: '',
    range: '',
    topSpeed: '',
    chargingTime: '',
    colorsInput: '',
    shortDescription: '',
    description: '',
    tag: '',
    featured: false,
    specs: defaultSpecRows,
  }
}

function toPayload(values: ProductFormValues): ProductPayload {
  return {
    name: values.name.trim(),
    slug: values.slug?.trim() || '',
    category: values.category.trim(),
    price: Number(values.price),
    battery: values.battery.trim(),
    range: values.range.trim(),
    topSpeed: values.topSpeed.trim(),
    chargingTime: values.chargingTime.trim(),
    colors: values.colorsInput.split(',').map((item) => item.trim()).filter(Boolean),
    shortDescription: values.shortDescription.trim(),
    description: values.description.trim(),
    tag: values.tag?.trim() || '',
    featured: values.featured ?? false,
    removeImage: false,
    specs: values.specs.map((spec) => ({
      label: spec.label.trim(),
      value: spec.value.trim(),
    })),
  }
}

export function AdminProductsPage() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageError, setImageError] = useState('')
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false)
  const [serverMessage, setServerMessage] = useState('')
  const [serverError, setServerError] = useState('')
  const queryClient = useQueryClient()

  const productsQuery = useQuery({
    queryKey: ['admin-products'],
    queryFn: getAdminProducts,
  })

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getDefaultValues(),
  })

  const specsFieldArray = useFieldArray({
    control: form.control,
    name: 'specs',
  })

  const createMutation = useMutation({
    mutationFn: ({ payload, file }: { payload: ProductPayload; file: File }) => createProduct(payload, file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      void queryClient.invalidateQueries({ queryKey: ['products'] })
      setServerMessage('Product created successfully and synced to the main products page.')
      resetForm()
    },
    onError: (error) => {
      setServerError(getErrorMessage(error))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      productId,
      payload,
      file,
    }: {
      productId: string
      payload: ProductPayload
      file?: File | null
    }) => updateProduct(productId, payload, file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      void queryClient.invalidateQueries({ queryKey: ['products'] })
      setServerMessage('Product updated successfully.')
      resetForm()
    },
    onError: (error) => {
      setServerError(getErrorMessage(error))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      void queryClient.invalidateQueries({ queryKey: ['products'] })
      setServerMessage('Product deleted successfully.')
      if (editingProduct) {
        resetForm()
      }
    },
    onError: (error) => {
      setServerError(getErrorMessage(error))
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const products = productsQuery.data ?? []

  useEffect(() => {
    if (!imageFile) {
      return
    }

    const objectUrl = URL.createObjectURL(imageFile)
    setImagePreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [imageFile])

  const totalFeatured = useMemo(() => products.filter((product) => product.featured).length, [products])

  function resetForm() {
    setEditingProduct(null)
    setImageFile(null)
    setImagePreview('')
    setImageError('')
    setRemoveCurrentImage(false)
    form.reset(getDefaultValues())
  }

  function startEditing(product: Product) {
    setEditingProduct(product)
    setServerError('')
    setServerMessage('')
    setImageError('')
    setImageFile(null)
    setRemoveCurrentImage(false)
    setImagePreview(product.image)
    form.reset({
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      battery: product.battery,
      range: product.range,
      topSpeed: product.topSpeed,
      chargingTime: product.chargingTime,
      colorsInput: product.colors.join(', '),
      shortDescription: product.shortDescription,
      description: product.description,
      tag: product.tag ?? '',
      featured: Boolean(product.featured),
      specs: product.specs.length ? product.specs : defaultSpecRows,
    })
  }

  async function handleDelete(productId: string) {
    if (!window.confirm('Delete this product? This action cannot be undone.')) {
      return
    }

    setServerError('')
    setServerMessage('')
    await deleteMutation.mutateAsync(productId)
  }

  return (
    <>
      <Reveal>
        <section className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(243,247,255,0.9))] p-6 shadow-[0_24px_80px_rgba(8,17,31,0.24)] sm:p-8">
          <div className="space-y-8">
            <div>
              <Badge>Admin Products</Badge>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl xl:text-5xl">
                Keep the Energion lineup accurate, polished, and ready for the public catalog.
              </h1>
              <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-600 sm:text-base">
                Add document-based specs, update pricing, manage colors, and upload product visuals here.
                Once saved, each product becomes part of the public products page automatically.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {docModels.map((model) => (
                  <Badge key={model}>{model}</Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.8rem] bg-slate-950 p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.28)]">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Catalog Size</div>
                <div className="mt-4 text-4xl font-semibold">{products.length}</div>
                <p className="mt-2 text-sm leading-7 text-slate-300">Current models available to riders on the public site.</p>
              </div>
              <div className="rounded-[1.6rem] border border-[rgba(16,27,45,0.08)] bg-white/85 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Hero Models</div>
                <div className="mt-4 text-4xl font-semibold text-slate-950">{totalFeatured}</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">Listings currently highlighted with stronger visibility.</p>
              </div>
              <div className="rounded-[1.6rem] border border-[rgba(16,27,45,0.08)] bg-white/85 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Visual Assets</div>
                <div className="mt-4 text-4xl font-semibold text-slate-950">Images</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">Product photos here support the cards and the modal details view.</p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="space-y-5">
        <Reveal delay={0.08}>
          <section className="w-full rounded-[2.2rem] border border-white/10 bg-white/92 p-6 shadow-[0_24px_80px_rgba(8,17,31,0.22)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge>{editingProduct ? 'Edit Product' : 'Add Product'}</Badge>
                <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {editingProduct ? `Update ${editingProduct.name}` : 'Create a new product listing'}
                </h2>
              </div>
              <Button variant="secondary" onClick={resetForm}>
                <RefreshCcw className="mr-2 size-4" />
                Reset form
              </Button>
            </div>

            {serverError ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {serverError}
              </div>
            ) : null}
            {serverMessage ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {serverMessage}
              </div>
            ) : null}

            <form
              className="mt-8 space-y-6"
              onSubmit={form.handleSubmit(async (values) => {
                setServerError('')
                setServerMessage('')
                setImageError('')

                const payload = toPayload(values)
                payload.removeImage = removeCurrentImage

                if (!editingProduct && !imageFile) {
                  setImageError('Product image is required when creating a new product.')
                  return
                }

                if (editingProduct) {
                  await updateMutation.mutateAsync({
                    productId: editingProduct.id,
                    payload,
                    file: imageFile,
                  })
                  return
                }

                await createMutation.mutateAsync({
                  payload,
                  file: imageFile as File,
                })
              })}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Product Name" placeholder="EVOX" {...form.register('name')} error={form.formState.errors.name?.message} />
                <Input label="Slug" placeholder="Auto from name if empty" {...form.register('slug')} error={form.formState.errors.slug?.message} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-800">Category</span>
                  <select
                    className="h-12 rounded-2xl border border-[rgba(16,27,45,0.1)] bg-white/90 px-4 text-sm text-slate-900 outline-none transition focus:border-[rgba(49,94,230,0.38)] focus:ring-4 focus:ring-[rgba(49,94,230,0.1)]"
                    {...form.register('category')}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <Input
                  label="Price (BDT)"
                  type="number"
                  placeholder="245000"
                  {...form.register('price', { valueAsNumber: true })}
                  error={form.formState.errors.price?.message}
                />
                <Input label="Battery" placeholder="60V 26Ah" {...form.register('battery')} error={form.formState.errors.battery?.message} />
                <Input label="Range / Mileage" placeholder="85-95 Km" {...form.register('range')} error={form.formState.errors.range?.message} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <Input label="Top Speed" placeholder="45-50 Km/h" {...form.register('topSpeed')} error={form.formState.errors.topSpeed?.message} />
                <Input label="Charging Time" placeholder="6-7 Hours" {...form.register('chargingTime')} error={form.formState.errors.chargingTime?.message} />
                <Input label="Tag" placeholder="Performance" {...form.register('tag')} error={form.formState.errors.tag?.message} />
                <label className="flex items-center gap-3 rounded-[1.4rem] border border-[rgba(16,27,45,0.08)] bg-slate-50/80 px-4 py-4 text-sm font-medium text-slate-700">
                  <input type="checkbox" className="size-4 rounded border-slate-300" {...form.register('featured')} />
                  Mark as featured product
                </label>
              </div>

              <Input
                label="Available Colors"
                placeholder="Gorgeous Black, Cherry Red"
                {...form.register('colorsInput')}
                error={form.formState.errors.colorsInput?.message}
              />

              <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <Textarea
                  label="Short Description"
                  placeholder="A city-ready electric scooter with balanced range and everyday practicality."
                  {...form.register('shortDescription')}
                  error={form.formState.errors.shortDescription?.message}
                  className="min-h-28"
                />
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-800">Product Image</span>
                  <div className="rounded-[1.8rem] border border-dashed border-[rgba(49,94,230,0.24)] bg-slate-50/80 p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null
                        setImageFile(file)
                        setImageError('')
                        if (file) {
                          setRemoveCurrentImage(false)
                        }
                        if (!file && editingProduct) {
                          setImagePreview(removeCurrentImage ? '' : editingProduct.image)
                        }
                      }}
                      className="hidden"
                      id="product-image-upload"
                    />
                    <label
                      htmlFor="product-image-upload"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-white bg-white px-4 py-6 text-center"
                    >
                      <UploadCloud className="size-7 text-[var(--brand-start)]" />
                      <div className="mt-3 text-sm font-semibold text-slate-900">
                        {imageFile ? imageFile.name : 'Click to upload an image'}
                      </div>
                      <div className="mt-2 text-xs leading-6 text-slate-500">
                        Required on create. Optional on edit. JPG, PNG, WEBP supported.
                      </div>
                    </label>

                    {imagePreview ? (
                      <div className="mt-4 overflow-hidden rounded-[1.4rem]">
                        <img src={imagePreview} alt="Preview" className="h-44 w-full object-cover" />
                      </div>
                    ) : (
                      <div className="mt-4 flex h-44 items-center justify-center rounded-[1.4rem] border border-dashed border-[rgba(16,27,45,0.1)] bg-white/80 text-sm text-slate-500">
                        <ImagePlus className="mr-2 size-4" />
                        No image selected yet
                      </div>
                    )}
                    {editingProduct ? (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setImageFile(null)
                            setRemoveCurrentImage(true)
                            setImagePreview('')
                            setImageError('')
                          }}
                        >
                          <ImageOff className="mr-2 size-4" />
                          Remove current image
                        </Button>
                        {removeCurrentImage ? (
                          <span className="self-center text-sm font-medium text-amber-600">
                            This product will save without an image until you upload a new one.
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  {imageError ? <span className="text-sm text-rose-500">{imageError}</span> : null}
                </label>
              </div>

              <Textarea
                label="Full Description"
                placeholder="Write the detailed product description shown in the modal and admin-managed listing."
                {...form.register('description')}
                error={form.formState.errors.description?.message}
              />

              <div className="rounded-[1.8rem] border border-[rgba(16,27,45,0.08)] bg-slate-50/70 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Features & Specs</div>
                    <div className="mt-1 text-sm leading-7 text-slate-600">
                      These rows map directly to the company document fields like motor, controller, dimension,
                      clearance, braking, display, weight, and feature list.
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => specsFieldArray.append({ label: '', value: '' })}
                  >
                    <Plus className="mr-2 size-4" />
                    Add spec
                  </Button>
                </div>

                <div className="mt-5 space-y-4">
                  {specsFieldArray.fields.map((field, index) => (
                    <div key={field.id} className="grid gap-4 rounded-[1.5rem] border border-[rgba(16,27,45,0.08)] bg-white p-4 sm:grid-cols-[1fr_1.6fr_auto]">
                      <Input
                        label="Label"
                        placeholder="Motor"
                        {...form.register(`specs.${index}.label`)}
                        error={form.formState.errors.specs?.[index]?.label?.message}
                      />
                      <Input
                        label="Value"
                        placeholder="1000W"
                        {...form.register(`specs.${index}.value`)}
                        error={form.formState.errors.specs?.[index]?.value?.message}
                      />
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-center border border-[rgba(16,27,45,0.08)]"
                          onClick={() => specsFieldArray.remove(index)}
                          disabled={specsFieldArray.fields.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? editingProduct
                      ? 'Updating product...'
                      : 'Creating product...'
                    : editingProduct
                      ? 'Update product'
                      : 'Create product'}
                </Button>
                {editingProduct ? (
                  <Button type="button" variant="secondary" onClick={resetForm}>
                    Cancel edit
                  </Button>
                ) : null}
              </div>
            </form>
          </section>
        </Reveal>

        <Reveal delay={0.12}>
          <section className="rounded-[2.2rem] border border-white/10 bg-white/92 p-6 shadow-[0_24px_80px_rgba(8,17,31,0.22)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge>Manage Products</Badge>
                <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  Current website products, ready for update or removal
                </h2>
              </div>
              <div className="text-sm text-slate-500">Every record here feeds the main Energion products page</div>
            </div>

            {productsQuery.isLoading ? (
              <div className="mt-6">
                <LoadingState label="Loading admin products..." />
              </div>
            ) : productsQuery.isError ? (
              <div className="mt-6">
                <EmptyState
                  title="Products unavailable"
                  description="The admin product list could not be loaded. Check backend auth, MongoDB, and product API status."
                />
              </div>
            ) : products.length ? (
              <div className="mt-6 grid gap-4">
                {products.map((product, index) => (
                  <Reveal key={product.id} delay={0.04 * index} y={18}>
                    <article className="overflow-hidden rounded-[2rem] border border-[rgba(16,27,45,0.08)] bg-slate-50/80 shadow-[0_16px_36px_rgba(8,17,31,0.06)] transition hover:-translate-y-1">
                      <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[220px_minmax(0,1fr)_auto] xl:items-start">
                        <div className="overflow-hidden rounded-[1.5rem]">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
                          ) : (
                            <div className="flex h-44 w-full items-center justify-center bg-slate-100 text-center text-sm font-medium text-slate-500">
                              <div>
                                <ImageOff className="mx-auto size-6 text-slate-400" />
                                <div className="mt-3">No product image</div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-2">
                            <Badge tone="gradient">{product.category}</Badge>
                            {product.tag ? <Badge>{product.tag}</Badge> : null}
                            {product.featured ? <Badge>Featured</Badge> : null}
                          </div>
                          <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950">{product.name}</h3>
                          <p className="mt-3 text-sm leading-7 text-slate-600">{product.shortDescription}</p>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                              ['Battery', product.battery],
                              ['Range', product.range],
                              ['Top Speed', product.topSpeed],
                              ['Charging', product.chargingTime],
                            ].map(([label, value]) => (
                              <div key={label} className="rounded-2xl border border-[rgba(16,27,45,0.06)] bg-white px-4 py-3">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
                                <div className="mt-2 text-sm font-semibold text-slate-900">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-row gap-3 xl:flex-col">
                          <Button type="button" variant="secondary" onClick={() => startEditing(product)}>
                            <Pencil className="mr-2 size-4" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="border border-rose-200 text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                            onClick={() => void handleDelete(product.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState
                  title="No products added yet"
                  description="Use the form to create the first product. After submission, it will appear here and on the public products page."
                />
              </div>
            )}
          </section>
        </Reveal>
      </div>
    </>
  )
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}
