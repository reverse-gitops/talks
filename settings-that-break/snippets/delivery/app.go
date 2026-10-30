cfg := ordererconfig.Load("/etc/orderer/config")      // generated from the CRDs
email := cfg.EmailSettings("order-confirmations")
key := cfg.ApiKey(email.APIKeyRef).Decrypt(ctx)   // workload identity → KMS
mailer.Send(email.Sender, email.TemplateID, key, order)

// no API calls, no database: settings are just files
