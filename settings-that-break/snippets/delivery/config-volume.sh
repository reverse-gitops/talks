/etc/orderer/config/
├── emailsettings/order-confirmations.yaml
├── apikey/sendgrid.yaml                        # spec only, no status
└── secret/sendgrid-api-key.sops.yaml           # still SOPS-encrypted

# emailsettings/order-confirmations.yaml
spec: { sender: orders@stroopwafel.nl, templateId: order-confirmed, apiKeyRef: sendgrid }
