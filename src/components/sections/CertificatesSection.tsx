"use client";

import React, { useState } from "react";
import { 
  Award, 
  ExternalLink, 
  FileCheck, 
  CheckCircle, 
  Eye, 
  Building2, 
  Calendar, 
  Hash, 
  FileText 
} from "lucide-react";
import { Certificate } from "@/lib/supabase/types";
import Modal from "../ui/Modal";

interface CertificatesSectionProps {
  certificates: Certificate[];
}

export default function CertificatesSection({ certificates }: CertificatesSectionProps) {
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [filterOrg, setFilterOrg] = useState<string>("All");

  const organizations = ["All", ...Array.from(new Set(certificates.map(c => c.issuing_organization)))];

  const filteredCerts = filterOrg === "All" 
    ? certificates 
    : certificates.filter(c => c.issuing_organization === filterOrg);

  return (
    <section id="certificates" className="py-24 relative bg-[#030712] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            04 &bull; CREDENTIALS & SPECIALIZATIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Verified <span className="text-gradient-cyan-purple">Certifications</span>
          </h2>
          <p className="text-gray-400 mt-3 text-base">
            Formal industry specializations and university-backed technical credentials in AI, Machine Learning, and Cloud Systems.
          </p>
        </div>

        {/* Organization Filter if more than 1 org */}
        {organizations.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {organizations.map((org) => (
              <button
                key={org}
                onClick={() => setFilterOrg(org)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterOrg === org
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-purple"
                    : "bg-gray-900/60 text-gray-400 border border-white/10 hover:text-white"
                }`}
              >
                {org}
              </button>
            ))}
          </div>
        )}

        {/* Certificate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group"
            >
              {/* Card Banner / Image Thumbnail */}
              <div className="relative h-44 w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden border-b border-white/5">
                {cert.certificate_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cert.certificate_image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-cyan-400/40 p-4">
                    <Award className="w-12 h-12 mb-2" />
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-500">Official Certification</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent opacity-90" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-black/70 backdrop-blur-md border border-white/10 text-cyan-300 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-cyan-400" />
                    {cert.issuing_organization}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {cert.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      {cert.issue_date}
                    </span>
                    {cert.credential_id && (
                      <span className="flex items-center gap-1 text-gray-400">
                        <Hash className="w-3.5 h-3.5 text-gray-500" />
                        {cert.credential_id}
                      </span>
                    )}
                  </div>

                  {cert.description && (
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed pt-1">
                      {cert.description}
                    </p>
                  )}
                </div>

                {/* Skills tags */}
                <div className="space-y-4 pt-2">
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/30 border border-purple-500/20 text-purple-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setActiveCert(cert)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-gray-900 border border-white/15 text-gray-200 hover:text-white hover:border-cyan-500/50 hover:bg-gray-800 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View</span>
                    </button>

                    {cert.verification_url && (
                      <a
                        href={cert.verification_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-600/40 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Verify</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {filteredCerts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No certificates found in this filter.
          </div>
        )}

        {/* Certificate Professional Viewer Modal */}
        {activeCert && (
          <Modal
            isOpen={Boolean(activeCert)}
            onClose={() => setActiveCert(null)}
            title={activeCert.title}
            maxWidth="2xl"
          >
            <div className="space-y-6">
              {/* Image or PDF container */}
              <div className="w-full min-h-[300px] max-h-[500px] rounded-xl overflow-hidden bg-gray-950 border border-white/10 flex items-center justify-center">
                {activeCert.certificate_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeCert.certificate_image_url}
                    alt={activeCert.title}
                    className="max-h-[500px] w-auto object-contain mx-auto"
                  />
                ) : activeCert.certificate_pdf_url ? (
                  <iframe
                    src={activeCert.certificate_pdf_url}
                    className="w-full h-[450px]"
                    title="Certificate Document"
                  />
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-2 text-cyan-400/50" />
                    <p className="text-sm">Verified Digital Credential</p>
                  </div>
                )}
              </div>

              {/* Certificate Details */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-900/60 border border-white/10 text-xs">
                  <div>
                    <span className="text-gray-500 block uppercase font-mono text-[10px]">Issuer</span>
                    <span className="text-white font-semibold">{activeCert.issuing_organization}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block uppercase font-mono text-[10px]">Issue Date</span>
                    <span className="text-white font-semibold">{activeCert.issue_date}</span>
                  </div>
                  {activeCert.credential_id && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-500 block uppercase font-mono text-[10px]">Credential ID</span>
                      <span className="text-cyan-300 font-mono">{activeCert.credential_id}</span>
                    </div>
                  )}
                </div>

                {activeCert.description && (
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {activeCert.description}
                  </p>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10">
                {(activeCert.certificate_image_url || activeCert.certificate_pdf_url) && (
                  <a
                    href={activeCert.certificate_image_url || activeCert.certificate_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-900 border border-white/15 text-white hover:border-cyan-400 transition-all flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in New Tab</span>
                  </a>
                )}

                {activeCert.verification_url && (
                  <a
                    href={activeCert.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Verify Credential</span>
                  </a>
                )}
              </div>

            </div>
          </Modal>
        )}

      </div>
    </section>
  );
}
