/settings/
└── resources/
    ├── coffeeconfig.yaml
    ├── coffee-mail.sops.yaml               # still SOPS-encrypted
    └── coffee-payments.sops.yaml           # still SOPS-encrypted

# resources/coffeeconfig.yaml
spec: { shopName: Coffee order system, mail: { apiKeySecretRef: { name: coffee-mail } } }
