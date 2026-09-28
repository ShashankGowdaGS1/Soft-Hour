import { storeInfo, regularDesserts, seasonalDesserts } from '../../data/desserts';
import './Visit.css';

export default function Visit() {
  const counterItems = [
    regularDesserts[0], // Dark Chocolate Mousse
    regularDesserts[1], // Pistachio Tart
    regularDesserts[2], // Burnt Cheesecake
    regularDesserts[3], // Tiramisu
    seasonalDesserts[0], // Alphonso Cheesecake
    seasonalDesserts[1], // Mango Saffron Tart
  ];

  return (
    <section id="visit" className="visit-section" aria-label="Visit and Order">
      <div className="container">
        {/* Section Header */}
        <div className="visit-editorial-header">
          <div className="visit-meta-row">
            <span className="editorial-num">[ PHYSICAL DISPATCH // INDIRANAGAR ]</span>
            <span className="crumb-cluster" aria-hidden="true">
              <span className="crumb-dot crumb-dot-sm" />
              <span className="crumb-dot crumb-dot-md" />
              <span className="crumb-dot crumb-dot-sm" />
            </span>
            <span className="recipe-note">11:00 AM — 10:00 PM DAILY</span>
          </div>

          <h2 className="visit-title">COME HUNGRY.</h2>
        </div>

        <div className="visit-split-stage">
          {/* Left Column: Letterpress Stationery Brand & Inquiries */}
          <div className="visit-stationery-card">
            <div className="stationery-brand-block">
              <span className="editorial-num">[ ATELIER LOCATION ]</span>
              <h3 className="stationery-brand-name">{storeInfo.brand}</h3>
              <span className="stationery-descriptor">{storeInfo.descriptor}</span>
            </div>

            <div className="stationery-detail-rows">
              <div className="stationery-detail-row">
                <span className="stationery-label">COORDINATES</span>
                <p className="stationery-value">{storeInfo.addressSummary}</p>
                <p className="stationery-subvalue">{storeInfo.city}, {storeInfo.country} · 12.9716° N, 77.5946° E</p>
              </div>

              <div className="stationery-detail-row">
                <span className="stationery-label">SERVICE WINDOW</span>
                <p className="stationery-value">{storeInfo.hours}</p>
                <p className="stationery-subvalue">Boutique seating · Counter takeaway</p>
              </div>

              <div className="stationery-detail-row">
                <span className="stationery-label">INQUIRIES &amp; ORDERS</span>
                <p className="stationery-value">atelier@softhour.com</p>
                <p className="stationery-subvalue">+91 (80) 4122 8900</p>
              </div>
            </div>

            {/* Actions */}
            <div className="stationery-actions">
              <a
                href="#visit"
                className="editorial-link stationery-cta"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Order for Pickup: WhatsApp orders open daily at 10:30 AM. Fresh boxes packaged in insulated atelier boxes.");
                }}
              >
                {storeInfo.pickupActionText} <span className="arrow">→</span>
              </a>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link stationery-cta"
              >
                {storeInfo.directionsActionText} <span className="arrow">→</span>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link stationery-cta"
              >
                {storeInfo.instagramActionText} ({storeInfo.instagramHandle}) <span className="arrow">→</span>
              </a>
            </div>
          </div>

          {/* Right Column: Boutique Printed Menu Sheet (Not a generic SaaS table) */}
          <div className="atelier-menu-sheet">
            {/* Registration marks at 4 corners */}
            <span className="sheet-cross sheet-cross-tl" aria-hidden="true">+</span>
            <span className="sheet-cross sheet-cross-tr" aria-hidden="true">+</span>
            <span className="sheet-cross sheet-cross-bl" aria-hidden="true">+</span>
            <span className="sheet-cross sheet-cross-br" aria-hidden="true">+</span>

            <div className="sheet-header">
              <div className="sheet-header-top">
                <span className="sheet-tag">SOFT HOUR // DAILY COUNTER DISPATCH</span>
                <span className="sheet-date">DATE: TODAY · MORNING FINISH</span>
              </div>
              <h3 className="sheet-title">IN THE GLASS TODAY</h3>
              <p className="sheet-sub">Pastries baked fresh from 06:30 AM. Dispatched until batch depletion.</p>
            </div>

            <div className="sheet-body" role="list">
              {counterItems.map((item) => {
                const isAvailable = item.availability === 'AVAILABLE';
                const isLow = item.availability === 'LOW';

                return (
                  <div key={item.id} className="sheet-pastry-row" role="listitem">
                    <div className="sheet-item-col-main">
                      <div className="sheet-item-title-wrap">
                        <span className="sheet-item-num">{item.number}</span>
                        <h4 className="sheet-item-name">{item.name}</h4>
                      </div>
                      <span className="sheet-item-notes">{item.flavorNotes}</span>
                    </div>

                    <div className="sheet-item-col-status">
                      <span className="sheet-item-price">{item.price}</span>
                      <span
                        className={`sheet-status-stamp ${
                          isAvailable ? 'stamp-available' : isLow ? 'stamp-low' : 'stamp-sold'
                        }`}
                      >
                        {isAvailable ? '● IN COUNTER' : isLow ? '▲ FINAL SLICES' : '― DEPLETED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sheet-footer">
              <span className="sheet-footer-rule" aria-hidden="true" />
              <p className="sheet-footnote">
                * Second afternoon finish leaves the kitchen at 04:30 PM. We do not hold pastry reservations past 30 minutes of stated collection time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
