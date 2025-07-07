import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faBuilding, faCalendarAlt, faLock, faEuroSign, faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
        cardName: ''
    });

    const handleCreditCardChange = (e) => {
        const { name, value } = e.target;
        setCreditCardData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatCardNumber = (value) => {
        return value.replace(/\s+/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiryDate = (value) => {
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length >= 2) {
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
                <div
                    className={`payment-method ${paymentMethod === 'credit' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('credit')}
                >
                    <div className="payment-icon">
                        <FontAwesomeIcon icon={faCreditCard} />
                    </div>
                    <div className="payment-info">
                        <h4>Carta di credito</h4>
                        <p>Visa, Mastercard, American Express</p>
                    </div>
                    <div className="payment-check">
                        {paymentMethod === 'credit' && <div className="check-mark">✓</div>}
                    </div>
                </div>

                <div
                    className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('paypal')}
                >
                    <div className="payment-icon">
                        <FontAwesomeIcon icon={faPaypal} />
                    </div>
                    <div className="payment-info">
                        <h4>PayPal</h4>
                        <p>Paga con il tuo account PayPal</p>
                    </div>
                    <div className="payment-check">
                        {paymentMethod === 'paypal' && <div className="check-mark">✓</div>}
                    </div>
                </div>

                <div
                    className={`payment-method ${paymentMethod === 'bank' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('bank')}
                >
                    <div className="payment-icon">
                        <FontAwesomeIcon icon={faBuilding} />
                    </div>
                    <div className="payment-info">
                        <h4>Bonifico bancario</h4>
                        <p>Pagamento entro 3 giorni lavorativi</p>
                    </div>
                    <div className="payment-check">
                        {paymentMethod === 'bank' && <div className="check-mark">✓</div>}
                    </div>
                </div>
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
                                    onChange={(e) => handleCreditCardChange({
                                        target: {
                                            name: 'cardNumber',
                                            value: e.target.value.replace(/\s/g, '').slice(0, 16)
                                        }
                                    })}
                                    className="form-input"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="label-icon" />
                                        Scadenza
                                    </label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        value={formatExpiryDate(creditCardData.expiryDate)}
                                        onChange={(e) => handleCreditCardChange({
                                            target: {
                                                name: 'expiryDate',
                                                value: e.target.value.replace(/\D/g, '').slice(0, 4)
                                            }
                                        })}
                                        className="form-input"
                                        placeholder="MM/AA"
                                        maxLength="5"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <FontAwesomeIcon icon={faLock} className="label-icon" />
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={creditCardData.cvv}
                                        onChange={(e) => handleCreditCardChange({
                                            target: {
                                                name: 'cvv',
                                                value: e.target.value.replace(/\D/g, '').slice(0, 3)
                                            }
                                        })}
                                        className="form-input"
                                        placeholder="123"
                                        maxLength="3"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Nome sulla carta</label>
                                <input
                                    type="text"
                                    name="cardName"
                                    value={creditCardData.cardName}
                                    onChange={handleCreditCardChange}
                                    className="form-input"
                                    placeholder={formData.user_name}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'paypal' && (
                        <div className="paypal-info">
                            <div className="payment-info-card">
                                <FontAwesomeIcon icon={faPaypal} className="info-icon" />
                                <h4>Pagamento con PayPal</h4>
                                <p>Verrai reindirizzato al sito PayPal per completare il pagamento in sicurezza.</p>
                                <div className="payment-amount">
                                    <strong>Importo: €{totalPrice.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'bank' && (
                        <div className="bank-info">
                            <div className="payment-info-card">
                                <FontAwesomeIcon icon={faBuilding} className="info-icon" />
                                <h4>Dettagli per il bonifico</h4>
                                <div className="bank-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Beneficiario:</span>
                                        <span className="detail-value">Events Management SRL</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">IBAN:</span>
                                        <span className="detail-value">IT60 X054 2811 1010 0000 0123 456</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Causale:</span>
                                        <span className="detail-value">Prenotazione #{Math.floor(Math.random() * 1000000)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Importo:</span>
                                        <span className="detail-value">€{totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="bank-note">
                                    <small>⚠️ Il pagamento deve essere effettuato entro 3 giorni lavorativi</small>
                                </div>
                            </div>
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
                    onClick={onProcessPayment}
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