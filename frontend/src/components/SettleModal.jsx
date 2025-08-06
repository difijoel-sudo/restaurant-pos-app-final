import React from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;`;
const ModalContent = styled.div` background: white; padding: 30px; border-radius: 12px; width: 100%; max-width: 500px;`;

function SettleModal({ order, onClose }) {
    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <h2>Settle Bill for Order #{order.id}</h2>
                <p>Total: ₹{order.grandTotal.toFixed(2)}</p>
                <p>Settle functionality coming soon!</p>
                <button onClick={onClose}>Close</button>
            </ModalContent>
        </ModalBackdrop>
    );
}

export default SettleModal;