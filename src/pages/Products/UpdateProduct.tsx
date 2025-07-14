import { useEffect } from 'react';
import { Form, Card, Spin, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from '../../utils/toast';
import {
  useGetProductQuery,
  useUpdateProductMutation,
} from '../../redux/features/products/apiProducts';
import { IProductFormData } from '../../types/product';
import dayjs from 'dayjs';
import ProductForm from '../../components/Forms/ProductForm';

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();

  const { data: productData, isLoading: productLoading } = useGetProductQuery(
    id!,
  );
  const [updateProduct, { isLoading: updateLoading }] =
    useUpdateProductMutation();

  console.log('productData~~', productData);

  // Utility function to generate slug
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (productData?.data) {
      const product: any = productData.data;
      form.setFieldsValue({
        title: product.title || '',
        slug: product.slug || '',
        img: product.img || '',
        unit: product.unit || '',
        parent: product.parent || '',
        children: product.children || '',
        price: product.price || 0,
        discount: product.discount || 0,
        quantity: product.quantity || 0,
        brandName: product.brand?.name || '',
        brandId: product.brand?.id || product.brand?._id || '',
        categoryName: product.category?.name || '',
        categoryId: product.category?.id || product.category?._id || '',
        categories: product.categories || '',
        subCategories: product.subCategories || '',
        subCategoriesItemName: product.subCategoriesItemName || '',
        status: product.status || 'in-stock',
        productType: product.productType || '',
        description: product.description || '',
        videoId: product.videoId || '',
        tags: product.tags || [],
        sizes: product.sizes || [],
        featured: product.featured || false,
        sku: product.sku || '',
        additionalImages: product.additionalImages || [],
        offerDate:
          product.offerDate?.startDate && product.offerDate?.endDate
            ? [
                dayjs(product.offerDate.startDate),
                dayjs(product.offerDate.endDate),
              ]
            : undefined,
      });
    }
  }, [productData, form]);

  const handleSubmit = async (formData: any) => {
    console.log('formData~~', formData);

    try {
      if (!formData.slug || formData.slug.trim() === '') {
        formData.slug = generateSlug(formData.title);
      }

      // Transform form data to match API expectations
      const productUpdateData: Partial<IProductFormData> = {
        ...formData,
        brandName: formData.brandName,
        brandId: formData.brandId,
        categoryName: formData.categoryName,
        categoryId: formData.categoryId,
      };

      const result: any = await updateProduct({
        id: id!,
        data: productUpdateData,
      });

      if (result && result?.data && result?.data?.status === 'success') {
        Toast.success('Product updated successfully');
        navigate('/products');
      } else if (result?.error) {
        Toast.error(result.error?.data?.message || 'Failed to update product');
      }
    } catch (error) {
      Toast.error('Failed to update product');
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (productLoading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>Loading product details...</p>
        </div>
      </Card>
    );
  }

  if (!productData?.data) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Product not found</p>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Update Product">
      <ProductForm
        form={form}
        onFinish={handleSubmit}
        loading={updateLoading}
        submitButtonText="Update Product"
        onCancel={handleCancel}
        showCancelButton={true}
        initialValues={productData?.data || null}
      />
    </Card>
  );
};

export default UpdateProduct;
