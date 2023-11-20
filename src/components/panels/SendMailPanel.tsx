import React, { useState } from 'react';
import { mailDataType } from '../../utils/types';

interface SendMailPanelProps {
  updateMail: (newMail: mailDataType) => void;
}

const SendMailPanel: React.FC<SendMailPanelProps> = ({ updateMail }) => {
  const [mail, setMail] = useState<mailDataType>({
    to: [''],
    subject: '',
    html: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMail(prevState => ({
      ...prevState,
      [name]: name === 'to' ? [value] : value
    }));
  };

  console.log('this is mail\n\n', mail)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMail(mail);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>To:</label>
          <input
            type="email"
            name="to"
            value={mail.to[0]}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            name="subject"
            value={mail.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>HTML Content:</label>
          <textarea
            name="html"
            value={mail.html}
            onChange={handleChange}
            required
          />
        </div>
      </form>
    </div>
  );
};

export default SendMailPanel;
