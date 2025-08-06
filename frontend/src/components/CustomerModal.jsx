import React from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;`;
const ModalContent = styled.div` background: white; padding: 30px; border-radius: 12px; width: 100%; max-width: 500px;`;

function CustomerModal({ orderId, onClose }) {
    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <h2>Add Customer to Order #{orderId}</h2>
                <p>Customer functionality coming soon!</p>
                <button onClick={onClose}>Close</button>
            </ModalContent>
        </ModalBackdrop>
    );
}

export default CustomerModal;