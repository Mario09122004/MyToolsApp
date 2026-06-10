import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { Icon, CloseIcon, TrashIcon, InfoIcon, AddIcon } from '@/components/ui/icon';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from '@/components/ui/modal';
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
} from '@/components/ui/alert-dialog';

// Helpers and Hooks
import { name_Screen } from '../helpers/name_screen';
import { useCRUDProducts, ProductWithIngredients } from '../hooks/entrepreneurship/useCRUDProducts';
import { useCRUDOrders, OrderWithProduct } from '../hooks/entrepreneurship/useCRUDOrders';

// Components
import { FormProduct } from '../components/Entrepreneurship/formProduct';
import { ProductItem } from '../components/Entrepreneurship/productItem';
import { ShoppingListCalculator } from '../components/Entrepreneurship/shoppingListCalculator';
import { ReservationsModal } from '../components/Entrepreneurship/reservationsModal';

type TabType = 'products' | 'shopping';

export default function EntrepreneurshipScreen() {
    const { changeNameScreen } = name_Screen();
    const { queryProducts, deleteProduct } = useCRUDProducts();
    const { queryOrders } = useCRUDOrders();

    // Screen setup
    useEffect(() => {
        changeNameScreen("Entrepreneurship");
    }, []);

    // State
    const [activeTab, setActiveTab] = useState<TabType>('products');
    const [dataProducts, setDataProducts] = useState<ProductWithIngredients[]>([]);
    const [orders, setOrders] = useState<OrderWithProduct[]>([]);
    
    // Modal & Dialog state
    const [modalVisible, setModalVisible] = useState(false);
    const [reservationsVisible, setReservationsVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number>(0);
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

    // Fetch Products from db
    const fetchProducts = async () => {
        try {
            const list = await queryProducts();
            setDataProducts(list);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // Fetch Reservations/Orders from db
    const fetchOrders = async () => {
        try {
            const list = await queryOrders();
            setOrders(list);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const loadData = async () => {
        await Promise.all([fetchProducts(), fetchOrders()]);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleNewProduct = () => {
        setEditMode(false);
        setSelectedProductId(0);
        setModalVisible(true);
    };

    const handleEditProduct = (id: number) => {
        setEditMode(true);
        setSelectedProductId(id);
        setModalVisible(true);
    };

    const handleDeleteClick = (id: number) => {
        setSelectedProductId(id);
        setDeleteConfirmVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedProductId > 0) {
            try {
                await deleteProduct(selectedProductId);
                await loadData(); // Refresh both products and orders (due to cascade delete)
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
        setDeleteConfirmVisible(false);
        setSelectedProductId(0);
    };

    return (
        <Box className="flex-1 bg-neutral-50 dark:bg-neutral-950">
            
            {/* Tab Selector Segment */}
            <Box className="flex-row p-2 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <TouchableOpacity 
                    onPress={() => setActiveTab('products')}
                    className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'products' ? 'bg-red-600' : 'bg-transparent'}`}
                >
                    <Text className={`font-bold ${activeTab === 'products' ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
                        Products & Recipes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setActiveTab('shopping')}
                    className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'shopping' ? 'bg-red-600' : 'bg-transparent'}`}
                >
                    <Text className={`font-bold ${activeTab === 'shopping' ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
                        Shopping List
                    </Text>
                </TouchableOpacity>
            </Box>

            {/* Tab Content */}
            {activeTab === 'products' ? (
                <>
                    <ScrollView className="flex-1 px-4 pt-4 pb-20" showsVerticalScrollIndicator={false}>
                        <Box className="gap-1 pb-24">
                            
                            {/* Reservations Summary Header Card */}
                            <TouchableOpacity 
                                onPress={() => setReservationsVisible(true)}
                                activeOpacity={0.8}
                                className="mb-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-4 rounded-xl flex-row justify-between items-center"
                            >
                                <Box className="flex-row items-center gap-2">
                                    <Text className="text-red-700 dark:text-red-400 font-bold text-sm">
                                        ★ Customer Reservations
                                    </Text>
                                    {orders.length > 0 ? (
                                        <Box className="bg-red-650 px-2 py-0.5 rounded-full">
                                            <Text className="text-white text-xs font-bold">{orders.length}</Text>
                                        </Box>
                                    ) : null}
                                </Box>
                                <Text className="text-red-600 dark:text-red-400 font-bold text-xs">Manage &gt;</Text>
                            </TouchableOpacity>

                            {dataProducts && dataProducts.length > 0 ? (
                                dataProducts.map((product) => {
                                    const productOrders = orders.filter(o => o.productId === product.id);
                                    const reservedQuantity = productOrders.reduce((sum, o) => sum + o.quantity, 0);
                                    const reservedOrdersCount = productOrders.length;

                                    return (
                                        <ProductItem 
                                            key={product.id}
                                            product={product}
                                            onEdit={handleEditProduct}
                                            onDelete={handleDeleteClick}
                                            reservedQuantity={reservedQuantity}
                                            reservedOrdersCount={reservedOrdersCount}
                                        />
                                    );
                                })
                            ) : (
                                <Box className="flex-1 items-center justify-center px-4">
                                    <Box className="w-full py-20 items-center justify-center bg-transparent border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-6 mb-24">
                                        <Box className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-900 items-center justify-center mb-3">
                                            <Icon as={InfoIcon} size="xl" className="text-red-600 dark:text-red-500" />
                                        </Box>
                                        <Text className="text-typography-500 font-semibold text-center text-base">
                                            No products registered yet
                                        </Text>
                                        <Text className="text-typography-400 text-center mt-1 text-sm">
                                            Press the "+" button below to register a product and its recipe.
                                        </Text>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </ScrollView>

                    {/* Floating Add Button */}
                    <Fab
                        size="lg"
                        placement="bottom right"
                        isHovered={false}
                        isDisabled={false}
                        isPressed={true}
                        onPress={handleNewProduct}
                        className="absolute bottom-6 right-4 bg-red-600 hover:bg-red-700 active:bg-red-800 border-none"
                    >
                        <FabIcon as={AddIcon} />
                        <FabLabel>Register</FabLabel>
                    </Fab>
                </>
            ) : (
                <ShoppingListCalculator products={dataProducts} orders={orders} />
            )}

            {/* Product registration/edit modal */}
            <Modal
                isOpen={modalVisible}
                onClose={() => setModalVisible(false)}
                size="lg"
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader className="border-b pb-3 relative">
                        <Heading size="lg" className="text-typography-900 font-bold">
                            {editMode ? "Edit Product" : "Register Product"}
                        </Heading>
                        <ModalCloseButton className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="py-4">
                        <FormProduct 
                            editMode={editMode}
                            productId={selectedProductId}
                            onSave={loadData}
                            onClose={() => setModalVisible(false)}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Reservations management modal */}
            <ReservationsModal 
                visible={reservationsVisible}
                onClose={() => setReservationsVisible(false)}
                products={dataProducts}
                onOrdersUpdated={fetchOrders}
            />

            {/* Delete Confirmation Alert Dialog */}
            <AlertDialog isOpen={deleteConfirmVisible} onClose={() => setDeleteConfirmVisible(false)}>
                <AlertDialogBackdrop />
                <AlertDialogContent className="max-w-[415px] gap-4 items-center">
                    <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                        <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
                    </Box>
                    <AlertDialogHeader className="mb-2">
                        <Heading size="md" className="text-typography-900 font-bold">Delete Product?</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text className="text-center text-typography-600">
                            This product and all its recipe ingredients will be deleted permanently. This action cannot be undone.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="mt-5 gap-3 w-full flex-row justify-center">
                        <Button
                            size="sm"
                            onPress={handleConfirmDelete}
                            className="px-[30px] bg-red-600 active:bg-red-700 hover:bg-red-700 border-none"
                        >
                            <ButtonText className="font-bold text-white">Delete</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            onPress={() => setDeleteConfirmVisible(false)}
                            size="sm"
                            className="px-[30px] border-neutral-300 dark:border-neutral-700 active:bg-neutral-50 dark:active:bg-neutral-900"
                        >
                            <ButtonText className="font-bold text-typography-700">Cancel</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Box>
    );
}