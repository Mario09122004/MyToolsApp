import { useState } from "react";

export const useModalNotes = (initialMode: boolean = false) => {
    const [addNoteModalVisible, setAddNoteModalVisible] = useState(initialMode);

    const openAddModal = () => setAddNoteModalVisible(true);
    const closeAddModal = () => setAddNoteModalVisible(false);

    return { addNoteModalVisible, openAddModal, closeAddModal };
};

