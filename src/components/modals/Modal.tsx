.modalBackdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modalContent {
    background-color: #ffe7ef;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    overflow: auto;
    position: relative;
    max-height: 80vh;
    width: 100%; /* Full width by default */
}

/* Modal size for screens larger than 600px (big modal) */
@media (min-width: 600px) {
    .modalContent {
        max-width: 600px;
    }
}

/* Modal size for screens smaller than 600px (medium modal) */
@media (max-width: 599px) {
    .modalContent {
        max-width: 500px;
    }
}

.modalContentConfirmation {
    background-color: #ffe7ef;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    overflow: auto;
    position: relative;
    max-height: 80vh;
    width: 100%;
    max-width: 400px;
    padding: 1rem;
    font-size: 14px;
}

/* Inner scrollable container */
.modalContentScrollable {
    max-height: calc(80vh - 2rem);
    overflow-y: auto;
    padding: 1.5rem;
}

/* Heading inside the modal */
.modalHeading {
    color: #575757;
    font-weight: bold;
    font-size: 18px;
    margin: 0.25rem 0;
}

/* Modal input header and input alignment */
.modalInputHeaderContainer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 0.5rem;
    padding-left: 0.5rem;
}

.modalInputLabel {
    font-size: 13px;
    font-weight: bold;
    color: #575757;
    margin-right: 170px;
}

/* Form container */
.modalItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 0;
    border-bottom: 1px solid #ddd;
}

/* Input and select field styles */
.modalSelect,
.modalInput {
    width: 100%;
    padding: 0.5rem 0.5rem;
    border: 1px solid #ACACAC;
    border-radius: 0.5rem;
    color: #575757;
    font-size: 13px;
    margin-bottom: 0.25rem;
}

.placeholder,
.modalSelect option {
    color: #868686;
}

.modalInputFixed {
    width: 200px;
    padding: 0.5rem 0.5rem;
    border: 1px solid #ACACAC;
    border-radius: 0.5rem;
    color: #575757;
    font-size: 13px;
    margin-bottom: 0.25rem;
}

.modalPrimary {
    text-align: left;
    color: #575757;
    font-size: 14px;
    /* font-weight: bold; */
}

.modalSecondary {
    text-align: left;
    color: #575757;
    font-size: 12px;
    font-style: italic;
}
.modalErrorText {
    color: #F96DAF;
    font-size: 12px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    line-height: 1.2;
    display: block;
    min-height: 12px;
}

/* Modal small button styles */
/* .modalSmallButtonContainer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.5rem;
    width: 100%;
}

.modalSmallButton {
    padding: 0.25rem 0.75rem;
    font-size: 13px;
    border-radius: 0.5rem;
    color: #575757;
    background-color: #FCB6D7;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    display: inline-block;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    outline: none;
}

.modalSmallButton:hover {
    background-color: #FA85BC;
    transform: translateY(-2px);
}

.modalSmallButton:active {
    background-color: #F9F9F9;
    transform: translateY(0);
}

.modalSmallButton:focus {
    box-shadow: 0 0 0 3px rgba(252, 182, 215, 0.5);
}

.modalSmallButton:disabled {
    background-color: #e0e0e0;
    color: #a0a0a0;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
} */
/* Modal small button styles */

/* Modal medium button styles */
.modalMediumButtonContainer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.75rem;
    width: 100%;
}

.modalMediumButton {
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    color: #575757;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    background-color: #FCB6D7;
    display: inline-block;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    outline: none;
    position: relative;
}

.modalMediumButton:hover {
    background-color: #FA85BC;
    transform: translateY(-2px);
    /* font-weight: bold; */
}

.modalMediumButton:active {
    background-color: #F9F9F9;
    transform: translateY(0);
}

.modalMediumButton:focus {
    box-shadow: 0 0 0 3px rgba(252, 182, 215, 0.5);
}

.modalMediumButton:disabled {
    background-color: #e0e0e0;
    color: #a0a0a0;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}
/* Modal medium button styles */

.modalTable {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.modalTable th,
.modalTable td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #575757;
}

.modalTable th {
    background-color: #ffe7ef;
    color: #575757;
    font-weight: bold;
}

.modalTable td {
    color: #575757;
}

.modalTable th:nth-child(3),
.modalTable td:nth-child(3) {
    text-align: right;
}


.modalEditIcon {
    color: #575757;
    font-size: 20px !important;
    cursor: pointer;
    transition: color 0.3s ease;
}

.modalEditIcon:hover {
    color: #FA85BC;
}

.modalDeleteIcon {
    color: #FF4d4F;
    margin-left: 10px;
    font-size: 20px !important;
    cursor: pointer;
    transition: color 0.3s ease;
}

.modalDeleteIcon:hover {
    color: #B23537;
}

.modalBackButton {
    font-size: 13px;
    font-weight: normal !important;
}

.modalTooltipText {
    visibility: hidden;
    background-color: #FCB6D7;
    color: #575757;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 100%;
    left: 50%;
    margin-left: -80px;
    opacity: 0;
    transition: opacity 0.3s;
    width: 150px;
}

.modalBackButton:hover .modalTooltipText {
    visibility: visible;
    opacity: 1;
}

.modalBackButtonIcon {
    font-size: 13px;
    color: #575757;
}

.successModal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #FCB6D7;
    color: #575757;
    padding: 2rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    text-align: center;
    font-size: 14px;
}

.successModal.hidden {
    display: none;
}