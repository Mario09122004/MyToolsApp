import { useState } from "react";

export const useBirthdayDeleteModal = (defaultinit: boolean = false) => {
    const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(defaultinit);
    const [idBirthday, setIdBirthday] = useState<number>(0);

    const openDeleteModal = (id: number) => {
        setDeleteConfirmModalVisible(true);
        setIdBirthday(id);
    };

    const closeDeleteModal = () => setDeleteConfirmModalVisible(false);

    return { deleteConfirmModalVisible, openDeleteModal, closeDeleteModal, idBirthday };
};
