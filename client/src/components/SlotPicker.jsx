// src/components/SlotPicker.jsx
import React, { useState } from 'react';

/**
 * Professional SlotPicker Component
 * Features: Framer-like interactions, accessibility ARIA labels, 
 * micro-interactions, and visual capacity indicators.
 */
export default function SlotPicker({
  slots = [],
  loading = false,
  error = null,
  selectedSlotId = null,
  onSelect = () => {},
}) {
  // --- Loading State ---
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingWrapper}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Fetching available times...</p>
        </div>
        <style>{spinnerKeyframes}</style>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div style={{ ...styles.errorCard }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  if (!slots.length) return null;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h3 style={styles.label}>Select Session</h3>
        <span style={styles.badge}>{slots.filter(s => s.remainingSeats > 0).length} Available</span>
      </header>

      <div style={styles.grid}>
        {slots.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          const isFull = slot.remainingSeats <= 0;
          const capacityPercentage = Math.max(0, (slot.remainingSeats / (slot.totalSeats ||4 )) * 100);

          return (
            <button
              key={slot.id}
              disabled={isFull}
              onClick={() => onSelect(slot.id)}
              onMouseEnter={(e) => !isFull && !isSelected && Object.assign(e.currentTarget.style, styles.buttonHover)}
              onMouseLeave={(e) => !isFull && !isSelected && Object.assign(e.currentTarget.style, styles.buttonBase)}
              style={{
                ...styles.buttonBase,
                ...(isSelected ? styles.buttonSelected : {}),
                ...(isFull ? styles.buttonDisabled : {}),
              }}
              aria-label={`Time slot ${slot.label}, ${slot.remainingSeats} seats remaining`}
            >
              <div style={styles.slotContent}>
                <span style={{ ...styles.timeLabel, color: isSelected ? '#FFF' : '#1E293B' }}>
                  {slot.label}
                </span>
                <span style={{ 
                  ...styles.statusLabel, 
                  color: isSelected ? 'rgba(255,255,255,0.8)' : isFull ? '#94A3B8' : '#64748B' 
                }}>
                  {isFull ? 'Sold Out' : `${slot.remainingSeats} spots left`}
                </span>
              </div>
              
              {/* Dynamic Capacity Bar */}
              {!isFull && (
                <div style={styles.progressTrack}>
                  <div style={{ 
                    ...styles.progressBar, 
                    width: `${capacityPercentage}%`,
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.4)' : '#6366F1'
                  }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Industrial Grade Styles ---
const styles = {
  container: {
    fontFamily: "Inter, -apple-system, system-ui, sans-serif",
    maxWidth: "500px",
    padding: "4px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#64748B",
    margin: 0,
  },
  badge: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "4px 10px",
    borderRadius: "20px",
    background: "#F1F5F9",
    color: "#475569",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "12px",
  },
  buttonBase: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    textAlign: "left",
    overflow: "hidden",
  },
  buttonHover: {
    borderColor: "#6366F1",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
  },
  buttonSelected: {
    background: "#6366F1",
    borderColor: "#4F46E5",
    boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.4)",
  },
  buttonDisabled: {
    background: "#F8FAFC",
    borderColor: "#F1F5F9",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  slotContent: {
    marginBottom: "8px",
    zIndex: 1,
  },
  timeLabel: {
    display: "block",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "2px",
  },
  statusLabel: {
    fontSize: "12px",
    fontWeight: "400",
  },
  progressTrack: {
    width: "100%",
    height: "4px",
    background: "rgba(0,0,0,0.05)",
    borderRadius: "2px",
    marginTop: "auto",
  },
  progressBar: {
    height: "100%",
    borderRadius: "2px",
    transition: "width 0.5s ease-out",
  },
  loadingWrapper: {
    textAlign: "center",
    padding: "40px 0",
  },
  spinner: {
    width: "28px",
    height: "28px",
    border: "3px solid #E2E8F0",
    borderTop: "3px solid #6366F1",
    borderRadius: "50%",
    margin: "0 auto",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "14px",
    color: "#64748B",
    marginTop: "12px",
  },
  errorCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    borderRadius: "12px",
    background: "#FEF2F2",
    color: "#B91C1C",
    fontSize: "14px",
    fontWeight: "500",
    border: "1px solid #FEE2E2",
  }
};

const spinnerKeyframes = `
  @keyframes spin { 
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;