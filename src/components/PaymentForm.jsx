import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faBuilding, faLock, faEuroSign, faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import '../css/PaymentForm.css';

const PaymentForm = ({
    paymentMethod,
    setPaymentMethod,
    onProcessPayment,
    onGoBack,
    paymentProcessing,
    formData,
    totalPrice,
    status,
    message
}) => {
    const [creditCardData, setCreditCardData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: formData.user_name || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCreditCardData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Validazione semplificata
    const validateInputs = () => {
        if (paymentMethod !== 'credit') return true;

        const errors = {};
        let isValid = true;

        // Validazione numero carta (almeno 12 cifre)
        if (!creditCardData.cardNumber || creditCardData.cardNumber.replace(/\D/g, '').length < 12) {
            errors.cardNumber = 'Inserisci un numero di carta valido';
            isValid = false;
        }

        // Validazione data scadenza (formato MM/AA)
        if (!creditCardData.expiryDate || !/^\d{2}\/\d{2}$/.test(creditCardData.expiryDate)) {
            errors.expiryDate = 'Formato data non valido (MM/AA)';
            isValid = false;
        }

        // Validazione CVV (3 o 4 cifre)
        if (!creditCardData.cvv || !/^\d{3,4}$/.test(creditCardData.cvv)) {
            errors.cvv = 'CVV non valido';
            isValid = false;
        }

        // Validazione nome (almeno 2 caratteri)
        if (!creditCardData.cardName || creditCardData.cardName.trim().length < 2) {
            errors.cardName = 'Nome sulla carta non valido';
            isValid = false;
        }

        if (!isValid) {
            alert(Object.values(errors).join('\n'));
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (paymentMethod === 'credit' && !validateInputs()) {
            return;
        }

        const paymentData = {
            ...formData,
            tickets: parseInt(formData.tickets),
            payment_method: paymentMethod === 'credit' ? 'credit_card' :
                paymentMethod === 'paypal' ? 'paypal' : 'bank_transfer',
            card_details: paymentMethod === 'credit' ? creditCardData : null
        };

        await onProcessPayment(paymentData);
    };

    // Formattazione automatica del numero di carta
    const formatCardNumber = (value) => {
        return value.replace(/\D/g, '')
            .replace(/(\d{4})(?=\d)/g, '$1 ')
            .slice(0, 19);
    };

    // Formattazione automatica della data di scadenza
    const formatExpiryDate = (value) => {
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length > 2) {
            return cleanValue.slice(0, 2) + '/' + cleanValue.slice(2, 4);
        }
        return cleanValue;
    };

    return (
        <div className="payment-form-card">
            <div className="payment-header">
                <FontAwesomeIcon icon={faLock} className="security-icon" />
                <h3 className="form-title">Pagamento Sicuro</h3>
            </div>

            <div className="payment-methods">
                {['credit', 'paypal', 'bank'].map(method => (
                    <div
                        key={method}
                        className={`payment-method ${paymentMethod === method ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod(method)}
                    >
                        <div className="payment-icon">
                            <FontAwesomeIcon icon={
                                method === 'credit' ? faCreditCard :
                                    method === 'paypal' ? faPaypal : faBuilding
                            } />
                        </div>
                        <div className="payment-info">
                            <h4>
                                {method === 'credit' ? 'Carta di credito' :
                                    method === 'paypal' ? 'PayPal' : 'Bonifico bancario'}
                            </h4>
                            <p>
                                {method === 'credit' ? 'Visa, Mastercard' :
                                    method === 'paypal' ? 'Paga con PayPal' : 'Pagamento in 3 giorni'}
                            </p>
                        </div>
                        {paymentMethod === method && <div className="check-mark">✓</div>}
                    </div>
                ))}
            </div>

            {paymentMethod && (
                <div className="payment-details">
                    {paymentMethod === 'credit' && (
                        <div className="credit-card-form">
                            <div className="form-group">
                                <label className="form-label">
                                    <FontAwesomeIcon icon={faCreditCard} className="label-icon" />
                                    Numero Carta
                                </label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={formatCardNumber(creditCardData.cardNumber)}
                                    onChange={(e) => handleInputChange({
                                        target: {
                                            name: 'cardNumber',
                                            value: e.target.value
                                        }
                                    })}
                                    className="form-input"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        Scadenza
                                    </label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        value={formatExpiryDate(creditCardData.expiryDate)}
                                        onChange={(e) => handleInputChange({
                                            target: {
                                                name: 'expiryDate',
                                                value: e.target.value
                                            }
                                        })}
                                        className="form-input"
                                        placeholder="MM/AA"
                                        maxLength="5"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={creditCardData.cvv}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="123"
                                        maxLength="4"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Nome sulla carta</label>
                                <input
                                    type="text"
                                    name="cardName"
                                    value={creditCardData.cardName}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Nome come sulla carta"
                                />
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'paypal' && (
                        <div className="paypal-info">
                            <p>Sarai reindirizzato a PayPal per completare il pagamento.</p>
                        </div>
                    )}

                    {paymentMethod === 'bank' && (
                        <div className="bank-info">
                            <p>IBAN: IT60 X054 2811 1010 0000 0123 456</p>
                            <p>Importo: €{totalPrice.toFixed(2)}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="payment-summary">
                <div className="summary-row">
                    <span>Totale da pagare:</span>
                    <span className="total-amount">€{totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <div className="payment-actions">
                <button
                    className="back-button"
                    onClick={onGoBack}
                    disabled={paymentProcessing}
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="button-icon" />
                    <span>Indietro</span>
                </button>

                <button
                    className={`submit-button ${paymentProcessing ? 'loading' : ''}`}
                    onClick={handleSubmit}
                    disabled={!paymentMethod || paymentProcessing}
                >
                    {paymentProcessing ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} spin className="button-icon" />
                            <span>Elaborazione...</span>
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faEuroSign} className="button-icon" />
                            <span>Conferma Pagamento</span>
                        </>
                    )}
                </button>
            </div>

            {status === 'error' && (
                <div className="alert alert-error">{message}</div>
            )}
        </div>
    );
};

export default PaymentForm;