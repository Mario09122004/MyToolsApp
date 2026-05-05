import { useState } from "react";

export const useNoteModalDelete = (defaultinit: boolean = false) => {
    const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(defaultinit);

    const openDeleteModal = () => setDeleteConfirmModalVisible(true);

    const closeDeleteModal = () => setDeleteConfirmModalVisible(false);

    return { deleteConfirmModalVisible, openDeleteModal, closeDeleteModal }
}