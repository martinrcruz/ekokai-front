/* Extiende la definición provisional de @types/web-bluetooth
   para incluir opciones nuevas de watchAdvertisements() */
   interface WatchAdvertisementsOptions {
    keepRepeatedDevices?: boolean;
    manufacturerData?: Array<{
      companyIdentifier: number;
      data?: DataView;
    }>;
    acceptAllAdvertisements?: boolean;
  }
  