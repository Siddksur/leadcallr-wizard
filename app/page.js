'use client';
import React, { useState } from 'react';

// Realistic industry metrics
const BENCHMARKS = {
  // Pick up rates
  newLeadPickupRate: 0.40, // 40% of new leads answer
  databasePickupRate: 0.20, // 20% of database answers
  
  // Conversion
  answerToAppointment: 0.05, // 5% of answered calls book
  appointmentToDeal: 0.20, // 20% of appointments close
  
  // Cost
  voiceAICost: 500, // Monthly cost
  avgAgentHourlyValue: 150, // Estimated hourly value of agent time
};

const steps = [
  'intro',
  'experience',
  'market',
  'database',
  'leadgen',
  'followup',
  'results-current',
  'contact',
  'results',
];

export default function VoiceAIAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    yearsInBusiness: '',
    serviceArea: '',
    avgPrice: 500000,
    commissionRate: 2.5,
    databaseSize: 2500,
    usesPaidAds: null,
    monthlyAdSpend: 1000,
    monthlyNewLeads: 0,
    whoFollowsUp: [],
    hasISA: null,
    isaCost: 0,
    prospectingHours: 5,
    currentAppointments: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const calculateResults = () => {
    const dbSize = formData.databaseSize || 0;
    const avgPrice = formData.avgPrice;
    const commission = formData.commissionRate / 100;
    const gciPerDeal = avgPrice * commission;
    const monthlyNewLeads = formData.monthlyNewLeads || 0;
    const currentAppts = formData.currentAppointments || 0;
    const prospectingHours = formData.prospectingHours || 0;
    const isaCost = formData.hasISA ? (formData.isaCost || 0) : 0;

    // DATABASE OPPORTUNITY (One-time harvest of entire database)
    const dbConversations = dbSize * BENCHMARKS.databasePickupRate;
    const dbAppointments = dbConversations * BENCHMARKS.answerToAppointment;
    const dbDeals = dbAppointments * BENCHMARKS.appointmentToDeal;
    const dbGCI = dbDeals * gciPerDeal;
    
    // NEW LEADS OPPORTUNITY (Yearly - ongoing)
    const monthlyNewLeadConversations = monthlyNewLeads * BENCHMARKS.newLeadPickupRate;
    const monthlyNewLeadAppointments = monthlyNewLeadConversations * BENCHMARKS.answerToAppointment;
    const monthlyNewLeadDeals = monthlyNewLeadAppointments * BENCHMARKS.appointmentToDeal;
    
    const yearlyNewLeadDeals = monthlyNewLeadDeals * 12;
    const yearlyNewLeadGCI = yearlyNewLeadDeals * gciPerDeal;
    
    // Time savings
    const hoursSavedWeekly = prospectingHours * 0.8;
    const hoursSavedYearly = hoursSavedWeekly * 50;
    const timeValueSaved = hoursSavedYearly * BENCHMARKS.avgAgentHourlyValue;
    
    // Cost analysis
    const yearlyVoiceAICost = BENCHMARKS.voiceAICost * 12;
    const yearlyISACost = isaCost * 12;
    const potentialSavings = yearlyISACost > 0 ? yearlyISACost - yearlyVoiceAICost : 0;
    
    // ROI Calculation (Year 1 = Database + First Year of New Leads)
    const totalYear1GCI = dbGCI + yearlyNewLeadGCI;
    const roi = yearlyVoiceAICost > 0 ? ((totalYear1GCI - yearlyVoiceAICost) / yearlyVoiceAICost) * 100 : 0;
    
    // Fit score based on ROI
    let fitScore = 0;
    if (roi >= 3000) fitScore = 98;
    else if (roi >= 2000) fitScore = 92;
    else if (roi >= 1000) fitScore = 85;
    else if (roi >= 500) fitScore = 75;
    else if (roi >= 300) fitScore = 65;
    else if (roi >= 200) fitScore = 55;
    else if (roi >= 100) fitScore = 45;
    else if (roi >= 50) fitScore = 35;
    else fitScore = Math.max(10, Math.round(roi / 2));
    
    // Fit level based on score
    let fitLevel = 'low';
    if (fitScore >= 65) fitLevel = 'high';
    else if (fitScore >= 40) fitLevel = 'medium';
    
    // Generate fit factors based on actual value drivers
    let fitFactors = [];
    if (dbGCI >= 100000) fitFactors.push('High-value database');
    else if (dbGCI >= 50000) fitFactors.push('Solid database value');
    else if (dbSize >= 1000) fitFactors.push('Growing database');
    
    if (yearlyNewLeadGCI >= 50000) fitFactors.push('Strong lead flow');
    else if (yearlyNewLeadGCI >= 20000) fitFactors.push('Good lead generation');
    else if (monthlyNewLeads >= 10) fitFactors.push('Active lead generation');
    
    if (gciPerDeal >= 20000) fitFactors.push('High GCI per deal');
    else if (gciPerDeal >= 12500) fitFactors.push('Good GCI per deal');
    
    if (potentialSavings > 0) fitFactors.push('ISA cost savings opportunity');
    if (hoursSavedYearly >= 200) fitFactors.push('Significant time savings');
    
    if (fitFactors.length === 0) fitFactors.push('Building momentum');

    return {
      // Inputs
      dbSize,
      monthlyNewLeads,
      gciPerDeal,
      currentAppts,
      prospectingHours,
      
      // Database opportunity (one-time)
      dbConversations: Math.round(dbConversations),
      dbAppointments: Math.round(dbAppointments * 10) / 10,
      dbDeals: Math.round(dbDeals * 10) / 10,
      dbGCI: Math.round(dbGCI),
      
      // New leads opportunity (yearly)
      monthlyNewLeadConversations: Math.round(monthlyNewLeadConversations * 10) / 10,
      monthlyNewLeadAppointments: Math.round(monthlyNewLeadAppointments * 10) / 10,
      monthlyNewLeadDeals: Math.round(monthlyNewLeadDeals * 100) / 100,
      yearlyNewLeadDeals: Math.round(yearlyNewLeadDeals * 10) / 10,
      yearlyNewLeadGCI: Math.round(yearlyNewLeadGCI),
      
      // Total Year 1
      totalYear1GCI: Math.round(totalYear1GCI),
      roi: Math.round(roi),
      
      // Time savings
      hoursSavedWeekly: Math.round(hoursSavedWeekly),
      hoursSavedYearly: Math.round(hoursSavedYearly),
      timeValueSaved: Math.round(timeValueSaved),
      
      // Costs
      yearlyVoiceAICost,
      potentialSavings: Math.round(potentialSavings),
      yearlyISACost,
      
      // Fit
      fitScore,
      fitLevel,
      fitFactors,
    };
  };

  const handleSubmitContact = () => {
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    nextStep();
    setTimeout(() => setShowResults(true), 500);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setFormData({
      yearsInBusiness: '',
      serviceArea: '',
      avgPrice: 500000,
      commissionRate: 2.5,
      databaseSize: 2500,
      usesPaidAds: null,
      monthlyAdSpend: 1000,
      monthlyNewLeads: 0,
      whoFollowsUp: [],
      hasISA: null,
      isaCost: 0,
      prospectingHours: 5,
      currentAppointments: 0,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });
    setResults(null);
    setShowResults(false);
  };

  const progressPercent = ((currentStep) / (steps.length - 1)) * 100;

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'intro':
        return <IntroStep onNext={nextStep} />;
      case 'experience':
        return <ExperienceStep data={formData} updateField={updateField} onNext={nextStep} />;
      case 'market':
        return <MarketStep data={formData} updateField={updateField} onNext={nextStep} onBack={prevStep} />;
      case 'database':
        return <DatabaseStep data={formData} updateField={updateField} onNext={nextStep} onBack={prevStep} />;
      case 'leadgen':
        return <LeadGenStep data={formData} updateField={updateField} onNext={nextStep} onBack={prevStep} />;
      case 'followup':
        return <FollowUpStep data={formData} updateField={updateField} onNext={nextStep} onBack={prevStep} />;
      case 'results-current':
        return <CurrentResultsStep data={formData} updateField={updateField} onNext={nextStep} onBack={prevStep} />;
      case 'contact':
        return <ContactStep data={formData} updateField={updateField} onSubmit={handleSubmitContact} onBack={prevStep} />;
      case 'results':
        return <ResultsStep results={results} data={formData} showResults={showResults} onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <span style={{ fontWeight: '600', fontSize: '18px', letterSpacing: '-0.02em' }}>LeadCallr AI</span>
        </div>
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>{Math.round(progressPercent)}%</span>
            <div style={{ width: '128px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div 
                style={{ height: '100%', backgroundColor: '#0f172a', borderRadius: '9999px', transition: 'width 0.5s ease-out', width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', minHeight: 'calc(100vh - 77px)' }}>
        <div 
          style={{ 
            width: '100%', 
            maxWidth: '640px', 
            transition: 'all 0.3s ease',
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? 'translateY(16px)' : 'translateY(0)'
          }}
        >
          {renderStep()}
        </div>
      </main>
    </div>
  );
}

// Step Components
function IntroStep({ onNext }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', fontSize: '14px', marginBottom: '32px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
        Free Assessment
      </div>
      
      <h1 style={{ fontSize: '42px', fontWeight: '700', lineHeight: '1.1', letterSpacing: '-0.02em', marginBottom: '24px' }}>
        Is Voice AI Right<br />
        <span style={{ color: '#64748b' }}>For Your Business?</span>
      </h1>
      
      <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '480px', margin: '0 auto 32px', lineHeight: '1.6' }}>
        Answer a few questions about your real estate business and we'll calculate 
        your potential ROI with real numbers.
      </p>

      <button
        onClick={onNext}
        style={{ padding: '16px 32px', backgroundColor: '#0f172a', color: 'white', borderRadius: '9999px', fontWeight: '600', fontSize: '18px', border: 'none', cursor: 'pointer', marginBottom: '16px' }}
      >
        Start Assessment →
      </button>

      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '32px' }}>Takes about 2 minutes • No obligation</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', paddingTop: '32px', borderTop: '1px solid #e2e8f0', maxWidth: '320px', margin: '0 auto' }}>
        {[
          { value: '500+', label: 'Agents Assessed' },
          { value: '2 min', label: 'To Complete' },
          { value: 'Free', label: 'ROI Analysis' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceStep({ data, updateField, onNext }) {
  const options = [
    { value: 'under1', label: 'Less than 1 year' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Question 1 of 7</p>
        <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#0f172a' }}>How long have you been in real estate?</h2>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              updateField('yearsInBusiness', opt.value);
              setTimeout(onNext, 300);
            }}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: data.yearsInBusiness === opt.value ? '2px solid #0f172a' : '1px solid #e2e8f0',
              backgroundColor: data.yearsInBusiness === opt.value ? '#f8fafc' : 'white',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ fontWeight: '500', color: '#0f172a' }}>{opt.label}</span>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: data.yearsInBusiness === opt.value ? 'none' : '2px solid #cbd5e1',
              backgroundColor: data.yearsInBusiness === opt.value ? '#0f172a' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {data.yearsInBusiness === opt.value && (
                <svg style={{ width: '12px', height: '12px', color: 'white' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MarketStep({ data, updateField, onNext, onBack }) {
  const formatPrice = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    color: '#0f172a'
  };

  const sliderStyle = {
    width: '100%',
    height: '6px',
    borderRadius: '9999px',
    appearance: 'none',
    backgroundColor: '#e2e8f0',
    cursor: 'pointer'
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Question 2 of 7</p>
        <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#0f172a' }}>Tell us about your market</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Primary service area
          </label>
          <input
            type="text"
            value={data.serviceArea}
            onChange={(e) => updateField('serviceArea', e.target.value)}
            placeholder="e.g., South Etobicoke, Toronto"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '16px' }}>
            Average home price in your market
          </label>
          <input
            type="range"
            min="200000"
            max="2000000"
            step="25000"
            value={data.avgPrice}
            onChange={(e) => updateField('avgPrice', parseInt(e.target.value))}
            style={sliderStyle}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>$200K</span>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{formatPrice(data.avgPrice)}</span>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>$2M+</span>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '16px' }}>
            Your typical commission rate
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.25"
            value={data.commissionRate}
            onChange={(e) => updateField('commissionRate', parseFloat(e.target.value))}
            style={sliderStyle}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>1%</span>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{data.commissionRate}%</span>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>5%</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        <button onClick={onBack} style={{ padding: '14px 24px', border: '1px solid #e2e8f0', borderRadius: '9999px', fontWeight: '500', backgroundColor: 'white', cursor: 'pointer', color: '#374151' }}>
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.serviceArea}
          style={{ 
            flex: 1, 
            padding: '14px 24px', 
            backgroundColor: data.serviceArea ? '#0f172a' : '#94a3b8', 
            color: 'white', 
            borderRadius: '9999px', 
            fontWeight: '600', 
            border: 'none', 
            cursor: data.serviceArea ? 'pointer' : 'not-allowed' 
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function DatabaseStep({ data, updateField, onNext, onBack }) {
  const sliderStyle = {
    width: '100%',
    height: '6px',
    borderRadius: '9999px',
    appearance: 'none',
    backgroundColor: '#e2e8f0',
    cursor: 'pointer'
  };

  const formatNumber = (num) => {
    if (num >= 10000) return '10,000+';
    return num.toLocaleString();
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Question 3 of 7</p>
        <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#0f172a' }}>How many contacts are in your database?</h2>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Past clients, leads, sphere — everyone in your CRM.</p>
      </div>

      <div>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={data.databaseSize}
          onChange={(e) => updateField('databaseSize', parseInt(e.target.value))}
          style={sliderStyle}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>0</span>
          <span style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{formatNumber(data.databaseSize)}</span>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>10,000+</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        <button onClick={onBack} style={{ padding: '14px 24px', border: '1px solid #e2e8f0', borderRadius: '9999px', fontWeight: '500', backgroundColor: 'white', cursor: 'pointer', color: '#374151' }}>
          Back
        </button>
        <button onClick={onNext} style={{ flex: 1, padding: '14px 24px', backgroundColor: '#0f172a', color: 'white', borderRadius: '9999px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
          Continue
        </button>
      </div>
    </div>
  );
}

function LeadGenStep({ data, updateField, onNext, onBack }) {
  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    color: '#0f172a'
  };

  const sliderStyle = {
    width: '100%',
    height: '6px',
    borderRadius: '9999px',
    appearance: 'none',
    backgroundColor: '#e2e8f0',
    cursor: 'pointer'
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Question 4 of 7</p>
        <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#0f172a' }}>Do you generate leads through paid ads?</h2>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Google, Facebook, Instagram, Zillow, etc.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <button
          onClick={() => updateField('usesPaidAds', true)}
          style={{
            padding: '24px',
            borderRadius: '12px',
            border: data.usesPaidAds === true ? '2px solid #0f172a' : '1px solid #e2e8f0',
            backgroundColor: data.usesPaidAds === true ? '#f8fafc' : 'white',
            textAlign: 'center',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: '600',
            color: '#0f172a'
          }}
        >
          Yes
        </button>
        <button
          onClick={() => {
            updateField('usesPaidAds', false);
            updateField('monthlyAdSpend', 0);
            updateField('monthlyNewLeads', 0);
            setTimeout(onNext, 300);
          }}
          style={{
            padding: '24px',
            borderRadius: '12px',
            border: data.usesPaidAds === false ? '2px solid #0f172a' : '1px solid #e2e8f0',
            backgroundColor: data.usesPaidAds === false ? '#f8fafc' : 'white',
            textAlign: 'center',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: '600',
            color: '#0f172a'
          }}
        >
          No
        </button>
      </div>

      {data.usesPaidAds === true && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '16px' }}>
              Monthly ad spend
            </label>
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={data.monthlyAdSpend}
              onChange={(e) => updateField('monthlyAdSpend', parseInt(e.target.value))}
              style={sliderStyle}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>$500</span>
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>${data.monthlyAdSpend.toLocaleString()}/mo</span>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>$10K+</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              How many new leads per month?
            </label>
            <input
              type="number"
              min="0"
              value={data.monthlyNewLeads || ''}
              onChange={(e) => updateField('monthlyNewLeads', parseInt(e.target.value) || 0)}
              placeholder="e.g., 50"
              style={inputStyle}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        <button onClick={onBack} style={{ padding: '14px 24px', border: '1px solid #e2e8f0', borderRadius: '9999px', fontWeight: '500', backgroundColor: 'white', cursor: 'pointer', color: '#374151' }}>
          Back
        </button>
        {data.usesPaidAds === true && (
          <button onClick={onNext} style={{ flex: 1, padding: '14px 24px', backgroundColor: '#0f172a', color: 'white', borderRadius: '9999px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

function FollowUpStep({ data, updateField, onNext, onBack }) {
  const options = [
    { value: 'myself', label: 'I do it myself' },
    { value: 'isa', label: 'ISA / Assistant' },
    { value: 'team', label: 'Team members' },
    { value: 'nobody', label: 'Nobody consistently' },
  ];

  const toggleOption = (value) => {
    const current = data.whoFollowsUp || [];
    if (current.includes(value)) {
      updateField('whoFollowsUp', current.filter(v => v !== value));
      if (value === 'isa') updateField('hasISA', false);
    } else {
      updateField('whoFollowsUp', [...current, value]);
      if (value === 'isa') updateField('hasISA', true);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    color: '#0f172a'
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Question 5 of 7</p>
        <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#0f172a' }}>Who handles lead follow-up?</h2>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Select all that apply.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => toggleOption(opt.value)}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: (data.whoFollowsUp || []).includes(opt.value) ? '2px solid #0f172a' : '1px solid #e2e8f0',
              backgroundColor: (data.whoFollowsUp || []).includes(opt.value) ? '#f8fafc' : 'white',
              textAlign: 'center',
              cursor: 'pointer',
              fontWeight: '500',
              color: '#0f172a'
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {(data.whoFollowsUp || []).includes('isa') && (
        <div style={{ marginTop: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            What do you pay your ISA monthly?
          </label>
          <input
            type="number"
            min="0"
            value={data.isaCost || ''}
            onChange={(e) => updateField('isaCost', parseInt(e.target.value) || 0)}
            placeholder="e.g., 3000"
            style={inputStyle}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        <button onClick={onBack} style={{ padding: '14px 24px', border: '1px solid #e2e8f0', borderRadius: '9999px', fontWeight: '500', backgroundColor: 'white', cursor: 'pointer', color: '#374151' }}>
          Back
        </button>
        <button
          onClick={onNext}
          disabled={(data.whoFollowsUp || []).length === 0}
          style={{ 
            flex: 1, 
            padding: '14px 24px', 
            backgroundColor: (data.whoFollowsUp || []).length > 0 ? '#0f172a' : '#94a3b8', 
            color: 'white', 
            borderRadius: '9999px', 
            fontWeight: '600', 
            border: 'none', 
            cursor: (data.whoFollowsUp || []).length > 0 ? 'pointer' : 'not-allowed' 
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function CurrentResultsStep({ data, updateField, onNext, onBack }) {
  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    color: '#0f172a'
  };

  const sliderStyle = {
    width: '100%',
    height: '6px',
    borderRadius: '9999px',
    appearance: 'none',
    backgroundColor: '#e2e8f0',
    cursor: 'pointer'
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Question 6 of 7</p>
        <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#0f172a' }}>Your current prospecting</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '16px' }}>
            Hours per week on prospecting / follow-up
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={data.prospectingHours}
            onChange={(e) => updateField('prospectingHours', parseInt(e.target.value))}
            style={sliderStyle}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>0 hrs</span>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{data.prospectingHours} hrs/week</span>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>20+ hrs</span>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Appointments booked monthly
          </label>
          <input
            type="number"
            min="0"
            value={data.currentAppointments || ''}
            onChange={(e) => updateField('currentAppointments', parseInt(e.target.value) || 0)}
            placeholder="e.g., 5"
            style={inputStyle}
          />
          <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px' }}>From your database + new leads combined</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        <button onClick={onBack} style={{ padding: '14px 24px', border: '1px solid #e2e8f0', borderRadius: '9999px', fontWeight: '500', backgroundColor: 'white', cursor: 'pointer', color: '#374151' }}>
          Back
        </button>
        <button onClick={onNext} style={{ flex: 1, padding: '14px 24px', backgroundColor: '#0f172a', color: 'white', borderRadius: '9999px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
          Continue
        </button>
      </div>
    </div>
  );
}

function ContactStep({ data, updateField, onSubmit, onBack }) {
  const isValid = data.firstName && data.email && data.phone;

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    color: '#0f172a'
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Final Step</p>
        <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#0f172a' }}>Where should we send your results?</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>First name *</label>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              placeholder="John"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Last name</label>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              placeholder="Smith"
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Email *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="john@example.com"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Phone *</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="(416) 555-1234"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '24px' }}>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          Your information is secure and will only be used to deliver your personalized results.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        <button onClick={onBack} style={{ padding: '14px 24px', border: '1px solid #e2e8f0', borderRadius: '9999px', fontWeight: '500', backgroundColor: 'white', cursor: 'pointer', color: '#374151' }}>
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!isValid}
          style={{ 
            flex: 1, 
            padding: '14px 24px', 
            backgroundColor: isValid ? '#0f172a' : '#94a3b8', 
            color: 'white', 
            borderRadius: '9999px', 
            fontWeight: '600', 
            border: 'none', 
            cursor: isValid ? 'pointer' : 'not-allowed' 
          }}
        >
          See My Results →
        </button>
      </div>
    </div>
  );
}

function ResultsStep({ results, data, showResults, onRestart }) {
  if (!results) return null;

  const getFitColor = (level) => {
    if (level === 'high') return '#10b981';
    if (level === 'medium') return '#f59e0b';
    return '#94a3b8';
  };

  const getFitBg = (level) => {
    if (level === 'high') return { backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' };
    if (level === 'medium') return { backgroundColor: '#fffbeb', border: '1px solid #fde68a' };
    return { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' };
  };

  const getFitLabel = (level) => {
    if (level === 'high') return 'Strong Fit';
    if (level === 'medium') return 'Good Potential';
    return 'May Not Be Ready Yet';
  };

  const cardStyle = {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    marginBottom: '16px'
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '14px'
  };

  return (
    <div style={{ opacity: showResults ? 1 : 0, transform: showResults ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.7s ease' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', fontSize: '14px', fontWeight: '500', marginBottom: '16px', ...getFitBg(results.fitLevel) }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: getFitColor(results.fitLevel) }} />
          <span style={{ color: getFitColor(results.fitLevel) }}>{getFitLabel(results.fitLevel)}</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#0f172a' }}>{data.firstName}, here's your analysis</h2>
      </div>

      {/* Fit Score */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: '#64748b', fontSize: '14px' }}>ROI-Based Fit Score</span>
          <span style={{ fontSize: '24px', fontWeight: '700', color: getFitColor(results.fitLevel) }}>{results.fitScore}/100</span>
        </div>
        <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', backgroundColor: getFitColor(results.fitLevel), borderRadius: '9999px', transition: 'width 1s ease', width: showResults ? `${results.fitScore}%` : '0%' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          {results.fitFactors.map((factor, i) => (
            <span key={i} style={{ padding: '6px 12px', backgroundColor: '#f8fafc', borderRadius: '9999px', fontSize: '12px', color: '#64748b' }}>
              {factor}
            </span>
          ))}
        </div>
      </div>

      {/* Database Opportunity (One-Time) */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <h3 style={{ fontWeight: '600', fontSize: '18px', color: '#0f172a' }}>Database Opportunity</h3>
          <span style={{ padding: '4px 10px', backgroundColor: '#dbeafe', color: '#1d4ed8', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' }}>One-Time</span>
        </div>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
          The untapped value sitting in your existing database when Voice AI contacts everyone.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Potential Deals</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{results.dbDeals}</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Potential GCI</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>${results.dbGCI.toLocaleString()}</div>
          </div>
        </div>

        <div>
          <div style={rowStyle}><span style={{ color: '#64748b' }}>Database contacts</span><span style={{ color: '#0f172a' }}>{results.dbSize.toLocaleString()}</span></div>
          <div style={rowStyle}><span style={{ color: '#64748b' }}>Pick up (20%)</span><span style={{ color: '#0f172a' }}>{results.dbConversations.toLocaleString()} conversations</span></div>
          <div style={rowStyle}><span style={{ color: '#64748b' }}>Book appointment (5%)</span><span style={{ color: '#0f172a' }}>{results.dbAppointments} appointments</span></div>
          <div style={rowStyle}><span style={{ color: '#64748b' }}>Close deal (20%)</span><span style={{ color: '#0f172a' }}>{results.dbDeals} deals</span></div>
          <div style={{...rowStyle, borderBottom: 'none'}}><span style={{ color: '#64748b' }}>GCI per deal</span><span style={{ color: '#0f172a' }}>${results.gciPerDeal.toLocaleString()}</span></div>
        </div>
      </div>

      {/* New Leads Opportunity (Yearly) */}
      {results.monthlyNewLeads > 0 && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '600', fontSize: '18px', color: '#0f172a' }}>New Leads Opportunity</h3>
            <span style={{ padding: '4px 10px', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' }}>Ongoing Yearly</span>
          </div>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
            Additional revenue from your ongoing lead generation, calculated annually.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Deals Per Year</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{results.yearlyNewLeadDeals}</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>GCI Per Year</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>${results.yearlyNewLeadGCI.toLocaleString()}</div>
            </div>
          </div>

          <div>
            <div style={rowStyle}><span style={{ color: '#64748b' }}>New leads per month</span><span style={{ color: '#0f172a' }}>{results.monthlyNewLeads}</span></div>
            <div style={rowStyle}><span style={{ color: '#64748b' }}>Pick up (40%)</span><span style={{ color: '#0f172a' }}>{results.monthlyNewLeadConversations} conversations/mo</span></div>
            <div style={rowStyle}><span style={{ color: '#64748b' }}>Book appointment (5%)</span><span style={{ color: '#0f172a' }}>{results.monthlyNewLeadAppointments} appointments/mo</span></div>
            <div style={rowStyle}><span style={{ color: '#64748b' }}>Close deal (20%)</span><span style={{ color: '#0f172a' }}>{results.monthlyNewLeadDeals} deals/mo</span></div>
            <div style={{...rowStyle, borderBottom: 'none'}}><span style={{ color: '#64748b' }}>Yearly (×12)</span><span style={{ fontWeight: '600', color: '#0f172a' }}>{results.yearlyNewLeadDeals} deals/year</span></div>
          </div>
        </div>
      )}

      {/* Time Savings */}
      <div style={cardStyle}>
        <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '16px', color: '#0f172a' }}>Time Savings</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Hours Saved</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{results.hoursSavedYearly}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>per year</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Time Value</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>${results.timeValueSaved.toLocaleString()}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>at $150/hr</div>
          </div>
        </div>

        <div>
          <div style={rowStyle}><span style={{ color: '#64748b' }}>Current prospecting hours</span><span style={{ color: '#0f172a' }}>{results.prospectingHours} hrs/week</span></div>
          <div style={{...rowStyle, borderBottom: 'none'}}><span style={{ color: '#64748b' }}>Hours saved weekly (80%)</span><span style={{ color: '#0f172a' }}>{results.hoursSavedWeekly} hrs/week</span></div>
        </div>
      </div>

      {/* Investment & ROI */}
      <div style={cardStyle}>
        <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '16px', color: '#0f172a' }}>Investment & ROI</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Year 1 Potential GCI</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>${results.totalYear1GCI.toLocaleString()}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>database + new leads</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Year 1 ROI</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{results.roi.toLocaleString()}%</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>return on investment</div>
          </div>
        </div>

        <div>
          <div style={rowStyle}><span style={{ color: '#64748b' }}>Voice AI monthly cost</span><span style={{ color: '#0f172a' }}>$500/mo</span></div>
          <div style={rowStyle}><span style={{ color: '#64748b' }}>Voice AI yearly cost</span><span style={{ color: '#0f172a' }}>${results.yearlyVoiceAICost.toLocaleString()}/yr</span></div>
          {results.potentialSavings > 0 && (
            <>
              <div style={rowStyle}><span style={{ color: '#64748b' }}>Current ISA cost</span><span style={{ color: '#0f172a' }}>${results.yearlyISACost.toLocaleString()}/yr</span></div>
              <div style={{...rowStyle, borderBottom: 'none'}}><span style={{ color: '#64748b' }}>Potential ISA savings</span><span style={{ color: '#10b981', fontWeight: '600' }}>+${results.potentialSavings.toLocaleString()}/yr</span></div>
            </>
          )}
        </div>

        <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
          <p style={{ fontSize: '14px', color: '#166534', margin: 0 }}>
            <strong>Bottom line:</strong> Voice AI pays for itself with just {Math.ceil(results.yearlyVoiceAICost / results.gciPerDeal * 10) / 10} deal{Math.ceil(results.yearlyVoiceAICost / results.gciPerDeal) !== 1 ? 's' : ''} per year. Your potential is {results.dbDeals + results.yearlyNewLeadDeals} deals.
          </p>
        </div>
      </div>

      {/* CTA */}
      {results.fitLevel === 'high' || results.fitLevel === 'medium' ? (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>Ready to see Voice AI in action?</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Try Voice AI risk-free and hear exactly how it sounds calling your leads.
          </p>
          <button style={{ padding: '16px 32px', backgroundColor: '#0f172a', color: 'white', borderRadius: '9999px', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
            Start a Free Trial →
          </button>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>No credit card required • Cancel anytime</p>
          
          <button 
            onClick={onRestart}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '20px auto 0', padding: '8px 16px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '14px' }}
          >
            <span style={{ fontSize: '18px' }}>←</span> Take assessment again
          </button>
        </div>
      ) : (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>Voice AI might not be the best fit right now</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Based on your current situation, you might see better ROI by first growing your database or lead flow. 
            That said, every business is unique — happy to chat if you'd like.
          </p>
          <button style={{ padding: '12px 24px', border: '1px solid #e2e8f0', borderRadius: '9999px', fontWeight: '500', backgroundColor: 'white', cursor: 'pointer', color: '#374151' }}>
            Let's Chat Anyway
          </button>
          
          <button 
            onClick={onRestart}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '20px auto 0', padding: '8px 16px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '14px' }}
          >
            <span style={{ fontSize: '18px' }}>←</span> Take assessment again
          </button>
        </div>
      )}

      <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '24px' }}>
        * Projections based on industry averages. Actual results vary based on market conditions and lead quality.
      </p>
    </div>
  );
}
