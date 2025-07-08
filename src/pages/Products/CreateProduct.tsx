import { Form } from 'antd';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../utils/toast';
import { usePostProductMutation } from '../../redux/features/products/apiProducts';
import { IProductFormData } from '../../types/product';
import ProductForm from '../../components/Forms/ProductForm';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [createProduct, { isLoading: createLoading }] =
    usePostProductMutation();

  // Utility function to generate slug
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (!formData.slug || formData.slug.trim() === '') {
        formData.slug = generateSlug(formData.title);
      }

      // Transform form data to match API expectations
      const productData: IProductFormData = {
        ...formData,
        brandName: formData.brandName,
        brandId: formData.brandId,
        categoryName: formData.categoryName,
        categoryId: formData.categoryId,
        imageURLs: [],
      };

      const result: any = await createProduct({
        data: productData,
      });

      if (result && result?.data && result?.data?.status === 'success') {
        Toast.success('Product created successfully');
        navigate('/products');
      } else if (result?.error) {
        Toast.error(result.error?.data?.message || 'Failed to create product');
      }
    } catch (error) {
      Toast.error('Failed to create product');
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <Card title="Create New Product">
      <ProductForm
        form={form}
        onFinish={handleSubmit}
        loading={createLoading}
        submitButtonText="Create Product"
        onCancel={handleCancel}
        showCancelButton={true}
      />
    </Card>
  );
};

export default CreateProduct;
