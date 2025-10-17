import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styles from '../styles/UpdateConfirmationModal.module.css';

const UpdateConfirmationModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose} className={styles.modal}>
      <Modal.Header className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>Confirm Update</Modal.Title>
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        Are you sure you want to update this item?
      </Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <Button
          variant="secondary"
          onClick={handleClose}
          className={`${styles.button} ${styles.cancelButton}`}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          className={`${styles.button} ${styles.updateButton}`}
        >
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateConfirmationModal;
