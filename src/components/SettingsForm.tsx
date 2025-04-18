import React from 'react';

interface SettingsFormProps {
  form: { apiKey: string; apiSecret: string; surcharge: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ form, onChange, onSubmit }) => {
  return (
    <div>
      <h2>Payment Settings</h2>
      <input
        name="apiKey"
        value={form.apiKey}
        onChange={onChange}
        placeholder="API Key"
      />
      <input
        name="apiSecret"
        value={form.apiSecret}
        onChange={onChange}
        placeholder="API Secret"
      />
      <input
        name="surcharge"
        value={form.surcharge}
        onChange={onChange}
        placeholder="Surcharge %"
      />
      <button onClick={onSubmit}>Save</button>
    </div>
  );
};

export default SettingsForm;
