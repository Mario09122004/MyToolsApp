import { useState } from "react";

export const useNoteModalDelete = (defaultinit: boolean = false) => {
    const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(defaultinit);
    const [idNote, setIdNote] = useState(Number);

    const openDeleteModal = (id: number) => {
        setDeleteConfirmModalVisible(true)
        setIdNote(id);
    };

    const closeDeleteModal = () => setDeleteConfirmModalVisible(false);

    return { deleteConfirmModalVisible, openDeleteModal, closeDeleteModal, idNote }
}