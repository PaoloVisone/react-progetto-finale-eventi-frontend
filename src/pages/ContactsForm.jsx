import { useState } from 'react';
import emailjs from '@emailjs/browser';
import '../css/ContactsForm.css';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await emailjs.send(
                'service_5j5axyq',
                'template_wgzpfvm',
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    to_email: 'polvis.pv.22@gmail.com'
                },
                'Yi8Tme1WEo98WIRGS'
            );

            setSubmitStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setSubmitStatus('error');
            console.error('Errore:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="contact-form-container">
                <div className="page-header">
                    <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
                    <h1 className="page-title">Contattaci</h1>
                </div>


                {submitStatus === 'success' && (
                    <div className="alert alert-success">
                        Grazie! Il tuo messaggio è stato inviato con successo.
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="alert alert-danger">
                        Si è verificato un errore. Riprova più tardi.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nome</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Messaggio</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required />
                    </div>

                    <div class="button-container">
                        <button className='contacts-button' type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
                        </button>
                    </div>
                </form>
            </div></>
    );
};

export default ContactForm;