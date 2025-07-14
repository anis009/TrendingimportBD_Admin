import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Row,
  Col,
  Button,
  Space,
  Tabs,
  DatePicker,
} from 'antd';
import { useGetCategoriesQuery } from '../../redux/features/categories/apiCategories';
import { useGetSubCategoriesByCategoryQuery } from '../../redux/features/subcategories/apiSubCategories';
import { ICategory } from '../../types/category';
import { ISubCategory, IItem } from '../../types/subCategory';
import { IProduct } from '../../types/product';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FlexibleImageInput from '../ImageInput/FlexibleImageInput';
import MultipleImageUpload from '../ImageInput/MultipleImageUpload';
import axios from 'axios';
import useColorMode from '../../hooks/useColorMode';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface ProductFormProps {
  form: any;
  onFinish: (values: any) => void;
  loading?: boolean;
  initialValues?: Partial<IProduct>;
  submitButtonText?: string;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  onFinish,
  loading = false,
  initialValues,
  submitButtonText = 'Submit',
  onCancel,
  showCancelButton = true,
}) => {
  const [colorMode] = useColorMode();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);

  // Add state for description to manage ReactQuill value
  const [description, setDescription] = useState<string>('');

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery(undefined);

  // Only fetch subcategories when a category is selected
  const {
    data: subCategoriesData,
    isLoading: subCategoriesLoading,
    isFetching: subCategoriesFetching,
  } = useGetSubCategoriesByCategoryQuery(selectedCategoryId, {
    skip: !selectedCategoryId,
  });

  // Handle category selection change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(null);

    // Update form field value for category
    form.setFieldValue('categories', categoryId);

    // Clear subcategory and item selections when category changes
    form.setFieldsValue({
      subCategories: undefined,
      subCategoriesItemName: undefined,
    });
  };

  // Handle subcategory selection change
  const handleSubCategoryChange = (subCategoryId: string) => {
    setSelectedSubCategoryId(subCategoryId);

    // Update form field value for subcategory
    form.setFieldValue('subCategories', subCategoryId);

    // Clear item selection when subcategory changes
    form.setFieldsValue({
      subCategoriesItemName: undefined,
    });
  };

  // Handle subcategory item selection
  const handleSubCategoryItemChange = (itemId: string) => {
    form.setFieldValue('subCategoriesItemName', itemId);
  };

  // Handle description change from ReactQuill
  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    // Update the form field value
    form.setFieldValue('description', value);
  };

  // Helper function to extract path from full URL
  const extractPathFromUrl = (fullUrl: string): string => {
    try {
      const url = new URL(fullUrl);
      return url.pathname; // This will return the path without domain
    } catch (error) {
      // If it's already a path without domain, return as is
      return fullUrl;
    }
  };

  // Handle image upload (shared function for both main and additional images)
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      console.log('Starting upload for:', file.name);

      const formData = new FormData();
      formData.append('media', file);

      const response = await axios.post(
        'https://media.trendingimportbd.com/api/v1/upload/media',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Upload response:', response.data);

      if (response.data.success) {
        // Return only the path without domain for storage
        const pathOnly = response.data.file?.path || response.data.url;

        // If response.data.url contains full URL, extract path
        if (pathOnly && pathOnly.startsWith('http')) {
          const extractedPath = extractPathFromUrl(pathOnly);
          console.log('Extracted path for storage:', extractedPath);
          return extractedPath;
        }

        console.log('Path for storage:', pathOnly);
        return pathOnly;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      throw new Error(error.response?.data?.message || 'Upload failed');
    }
  };

  // Custom onFinish handler to ensure additionalImages is included
  const handleFormSubmit = (values: any) => {
    console.log('Form submitted with values:', values);

    // Ensure additionalImages is included in the submitted data
    const formData = {
      ...values,
      // Make sure additionalImages is always an array
      additionalImages: values.additionalImages || [],
    };

    // Convert image URLs to paths only (remove domain if present)
    if (formData.img && formData.img.startsWith('http')) {
      formData.img = extractPathFromUrl(formData.img);
    }

    if (formData.additionalImages && Array.isArray(formData.additionalImages)) {
      formData.additionalImages = formData.additionalImages.map(
        (url: string) => {
          return url.startsWith('http') ? extractPathFromUrl(url) : url;
        },
      );
    }

    console.log('Final form data being submitted:', formData);
    onFinish(formData);
  };

  // Set initial values when editing existing product
  useEffect(() => {
    if (initialValues) {
      // Set category
      if (initialValues.categories) {
        setSelectedCategoryId(initialValues.categories);
      }

      // Set subcategory
      if (initialValues.subCategories) {
        setSelectedSubCategoryId(initialValues.subCategories);
      }

      // Set description
      if (initialValues.description) {
        setDescription(initialValues.description);
      }
    }
  }, [initialValues]);

  // Handle form field changes
  useEffect(() => {
    const categoryValue = form.getFieldValue('categories');
    const subCategoryValue = form.getFieldValue('subCategories');
    const descriptionValue = form.getFieldValue('description');

    if (categoryValue && categoryValue !== selectedCategoryId) {
      setSelectedCategoryId(categoryValue);
    }

    if (subCategoryValue && subCategoryValue !== selectedSubCategoryId) {
      setSelectedSubCategoryId(subCategoryValue);
    }

    if (descriptionValue !== undefined && descriptionValue !== description) {
      setDescription(descriptionValue);
    }
  }, [form, selectedCategoryId, selectedSubCategoryId, description]);

  return (
    <div
      className={`product-form-container ${colorMode === 'dark' ? 'dark' : ''}`}
    >
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <Tabs defaultActiveKey="basic" type="card">
          <TabPane tab="Basic Info" key="basic">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Product Title"
                  name="title"
                  rules={[
                    { required: true, message: 'Please enter product title' },
                    { min: 3, message: 'Title must be at least 3 characters' },
                    { max: 200, message: 'Title cannot exceed 200 characters' },
                  ]}
                >
                  <Input placeholder="Enter product title" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="SKU" name="sku">
                  <Input placeholder="Enter SKU (optional)" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Slug"
                  name="slug"
                  help="Leave empty to auto-generate from title"
                >
                  <Input placeholder="Enter slug (optional)" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Unit"
                  name="unit"
                  rules={[{ required: true, message: 'Please enter unit' }]}
                >
                  <Input placeholder="Enter unit (e.g., piece, kg, liter)" />
                </Form.Item>
              </Col>
            </Row>

            {/* Main Image Upload */}
            <Form.Item
              label="Main Image"
              name="img"
              rules={[
                {
                  required: true,
                  message: 'Please upload an image',
                },
              ]}
            >
              <FlexibleImageInput
                uploadText="Click or drag file to upload main image"
                customRequest={handleImageUpload}
              />
            </Form.Item>

            {/* Multiple Images Upload - Now using the separate component */}
            <Form.Item
              label="Additional Images"
              name="additionalImages"
              help="Upload multiple product images (Each image uploads immediately)"
              initialValue={[]} // Ensure it starts as an empty array
            >
              <MultipleImageUpload
                maxCount={8}
                maxSize={10}
                customRequest={handleImageUpload}
              />
            </Form.Item>

            {/* Description field */}
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: false,
                  message: 'Please enter product description',
                },
              ]}
            >
              <div className={colorMode === 'dark' ? 'dark-quill' : ''}>
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter product description"
                  style={{
                    height: '200px',
                    marginBottom: '50px',
                    backgroundColor: colorMode === 'dark' ? '#1d2a39' : 'white',
                  }}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ script: 'sub' }, { script: 'super' }],
                      [{ indent: '-1' }, { indent: '+1' }],
                      [{ direction: 'rtl' }],
                      [{ size: ['small', false, 'large', 'huge'] }],
                      [{ color: [] }, { background: [] }],
                      [{ font: [] }],
                      [{ align: [] }],
                      ['link', 'image'],
                      ['blockquote', 'code-block'],
                      ['clean'],
                    ],
                  }}
                  formats={[
                    'header',
                    'font',
                    'size',
                    'bold',
                    'italic',
                    'underline',
                    'strike',
                    'blockquote',
                    'list',
                    'bullet',
                    'indent',
                    'link',
                    'image',
                    'color',
                    'background',
                    'align',
                    'script',
                    'direction',
                    'code-block',
                  ]}
                />
              </div>
            </Form.Item>
          </TabPane>

          {/* Categories & Classification Tab */}
          <TabPane tab="Categories & Classification" key="categories">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categories"
                  rules={[
                    { required: false, message: 'Please select a category' },
                  ]}
                  help="Select a category to load related subcategories"
                >
                  <Select
                    placeholder="Select a category"
                    loading={categoriesLoading}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={handleCategoryChange}
                    onClear={() => {
                      setSelectedCategoryId(null);
                      form.setFieldsValue({
                        categories: undefined,
                        subCategories: undefined,
                        subCategoriesItemName: undefined,
                      });
                    }}
                    value={selectedCategoryId}
                  >
                    {categoriesData?.data?.map((category: ICategory) => (
                      <Select.Option key={category._id} value={category._id}>
                        {category.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="SubCategory"
                  name="subCategories"
                  rules={[
                    { required: false, message: 'Please select a subcategory' },
                  ]}
                  help="Subcategories will load after selecting a category"
                >
                  <Select
                    placeholder={
                      !selectedCategoryId
                        ? 'Please select a category first'
                        : 'Select a subcategory'
                    }
                    loading={subCategoriesLoading || subCategoriesFetching}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    disabled={!selectedCategoryId}
                    onChange={handleSubCategoryChange}
                    onClear={() => {
                      setSelectedSubCategoryId(null);
                      form.setFieldsValue({
                        subCategories: undefined,
                        subCategoriesItemName: undefined,
                      });
                    }}
                    value={selectedSubCategoryId}
                    notFoundContent={
                      !selectedCategoryId
                        ? 'Please select a category first'
                        : subCategoriesLoading || subCategoriesFetching
                        ? 'Loading...'
                        : 'No subcategories found'
                    }
                  >
                    {subCategoriesData?.data?.map(
                      (subCategory: ISubCategory) => (
                        <Select.Option
                          key={subCategory._id}
                          value={subCategory._id}
                        >
                          {subCategory.title}
                        </Select.Option>
                      ),
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="SubCategory Item Name"
                  name="subCategoriesItemName"
                  help="Items will load after selecting a subcategory"
                >
                  <Select
                    placeholder={
                      !selectedCategoryId
                        ? 'Please select a category first'
                        : !selectedSubCategoryId
                        ? 'Please select a subcategory first'
                        : 'Select a SubCategory Item Name'
                    }
                    loading={subCategoriesLoading || subCategoriesFetching}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    disabled={!selectedSubCategoryId}
                    onChange={handleSubCategoryItemChange}
                    notFoundContent={
                      !selectedCategoryId
                        ? 'Please select a category first'
                        : !selectedSubCategoryId
                        ? 'Please select a subcategory first'
                        : 'No items found in this subcategory'
                    }
                  >
                    {selectedSubCategoryId &&
                      subCategoriesData?.data
                        ?.find(
                          (subCat: ISubCategory) =>
                            subCat._id === selectedSubCategoryId,
                        )
                        ?.items?.map((item: IItem) => (
                          <Select.Option key={item._id} value={item.name}>
                            {item.name}
                          </Select.Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Product Type"
                  name="productType"
                  rules={[
                    { required: false, message: 'Please enter product type' },
                  ]}
                >
                  <Input placeholder="Enter product type" />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          {/* Pricing & Inventory Tab */}
          <TabPane tab="Pricing & Inventory" key="pricing">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[
                    { required: false, message: 'Please enter price' },
                    {
                      type: 'number',
                      min: 0,
                      message: 'Price cannot be negative',
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    step={0.01}
                    precision={2}
                    placeholder="Enter price"
                    style={{ width: '100%' }}
                    addonBefore="$"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Discount (%)" name="discount">
                  <InputNumber
                    min={0}
                    max={100}
                    placeholder="Enter discount percentage"
                    style={{ width: '100%' }}
                    addonAfter="%"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Quantity"
                  name="quantity"
                  rules={[
                    { required: false, message: 'Please enter quantity' },
                    {
                      type: 'number',
                      min: 0,
                      message: 'Quantity cannot be negative',
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    placeholder="Enter quantity"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Brand Name"
                  name="brandName"
                  rules={[
                    { required: false, message: 'Please enter brand name' },
                  ]}
                >
                  <Input placeholder="Enter brand name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Brand ID"
                  name="brandId"
                  rules={[
                    { required: false, message: 'Please enter brand ID' },
                  ]}
                >
                  <Input placeholder="Enter brand ID" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Category Name"
                  name="categoryName"
                  rules={[
                    { required: false, message: 'Please enter category name' },
                  ]}
                >
                  <Input placeholder="Enter category name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Category ID"
                  name="categoryId"
                  rules={[
                    { required: false, message: 'Please enter category ID' },
                  ]}
                >
                  <Input placeholder="Enter category ID" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: false, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                <Select.Option value="in-stock">In Stock</Select.Option>
                <Select.Option value="out-of-stock">Out of Stock</Select.Option>
                <Select.Option value="discontinued">Discontinued</Select.Option>
              </Select>
            </Form.Item>
          </TabPane>

          {/* Additional Info Tab */}
          <TabPane tab="Additional Info" key="additional">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Video ID" name="videoId">
                  <Input placeholder="Enter video ID (optional)" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Featured Product"
                  name="featured"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Tags" name="tags">
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Enter tags"
                    tokenSeparators={[',']}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Available Sizes" name="sizes">
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Enter available sizes"
                    tokenSeparators={[',']}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Offer Period" name="offerDate">
              <RangePicker
                style={{ width: '100%' }}
                placeholder={['Start Date', 'End Date']}
                showTime
              />
            </Form.Item>
          </TabPane>
        </Tabs>

        <Form.Item
          style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}
        >
          <Space>
            {showCancelButton && <Button onClick={onCancel}>Cancel</Button>}
            <Button type="primary" htmlType="submit" loading={loading}>
              {submitButtonText}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductForm;
