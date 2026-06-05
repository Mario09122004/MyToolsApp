import { useState } from "react";

export const useModalBirthdays = (initialMode: boolean = false) => {
    const [addBirthdayModalVisible, setAddBirthdayModalVisible] = useState(initialMode);

    const openAddModal = () => setAddBirthdayModalVisible(true);
    const closeAddModal = () => setAddBirthdayModalVisible(false);

    return { addBirthdayModalVisible, openAddModal, closeAddModal };
};
