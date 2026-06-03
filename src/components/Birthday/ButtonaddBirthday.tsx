import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { AddIcon } from '@/components/ui/icon';
import { useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, CloseIcon } from '@/components/ui/icon';
import DatePicker from 'react-native-date-picker'
import { Input, InputField } from '@/components/ui/input';

export const ButtonAddBirthday = () => {
    const [ modalOpen, setModalOpen ] = useState(false);
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    return (
        <>
            <Fab
                size="lg"
                placement="bottom right"
                isHovered={false}
                isDisabled={false}
                isPressed={true}
                onPress={() => {
                    setModalOpen(true);
                }}
                className='absolute bottom-8 right-4 bg-white/20'
            >
                <FabIcon as={AddIcon} />
                <FabLabel>Register</FabLabel>
            </Fab>
            <Modal
                isOpen={modalOpen}
                onClose={() => {
                setModalOpen(false);
                }}
                size="md"
            >
                <ModalBackdrop />
                <ModalContent>
                <ModalHeader>
                    <Heading size="lg">Add Birthday</Heading>
                    <ModalCloseButton>
                    <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <ModalBody>
                    <Input
                        variant="outline"
                        size="md"
                        className="mb-4"
                    >
                        <InputField placeholder="Enter Name" />
                    </Input>

                    <Button onPress={() => setOpen(true)}>
                        <ButtonText>
                            {date.toLocaleDateString() === new Date().toLocaleDateString() 
                                ? "Select Date" 
                                : date.toLocaleDateString()}
                        </ButtonText>
                    </Button>

                    <DatePicker
                        modal
                        open={open}
                        date={date}
                        mode="date"
                        onConfirm={(selectedDate) => {
                            setOpen(false)
                            setDate(selectedDate)
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}
                    />
                </ModalBody>
                </ModalBody>
                <ModalFooter>
                    <Button
                    variant="outline"
                    action="secondary"
                    className="mr-3"
                    onPress={() => {
                        setModalOpen(false);
                    }}
                    >
                    <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                    onPress={() => {
                        setModalOpen(false);
                    }}
                    >
                    <ButtonText>Save</ButtonText>
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}