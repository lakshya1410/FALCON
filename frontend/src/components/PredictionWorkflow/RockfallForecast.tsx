import React, { useState, useMemo } from 'react';
import { AlertTriangle, Shield, CheckCircle, Navigation, TrendingUp, Clock, MapPin } from 'lucide-react';
import InteractiveMap from '../InteractiveMapNew';

interface RockfallForecastProps {
  results: any;
  onBack: () => void;
  onBackToDashboard: () => void;
}



const RockfallForecast: React.FC<RockfallForecastProps> = ({ 
  results, 
  onBack, 
  onBackToDashboard 
}) => {
  const [selectedZone, setSelectedZone] = useState<any>(null);

  // Debug logging
  console.log('🔍 RockfallForecast received results:', results);

  // Early return with loading screen if no results
  if (!results) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading Results...</h2>
          <p className="text-slate-400">Processing analysis data</p>
        </div>
      </div>
    );
  }

  // Calculate combined results from all models automatically
  const combinedResults = useMemo(() => {
    // Add safety check for results
    if (!results) {
      console.warn('⚠ RockfallForecast: No results provided');
      return {
        overallRisk: 'Unknown',
        confidence: 0,
        averageRiskScore: 0,
        riskChances: 0,
        modelResults: [],
        contributingModels: 0,
        zones: []
      };
    }

    // Check if we have comprehensive analysis data
    if (results.completeAnalysisData?.analyses) {
      const analyses = results.completeAnalysisData.analyses;
      const riskScores: number[] = [];
      const confidenceScores: number[] = [];
      const modelResults: string[] = [];

      // Debug logging
      console.log('🔍 Processing comprehensive analysis data:', analyses);

      // Weather Model Results
      if (analyses.weather?.success && analyses.weather.risk_assessment) {
        riskScores.push(analyses.weather.risk_assessment.risk_score);
        confidenceScores.push(analyses.weather.risk_assessment.confidence * 100);
        modelResults.push(`Weather: ${analyses.weather.risk_assessment.risk_level}`);
      }

      // Crack Segmentation Results - Convert to risk score
      if (analyses.crack_segmentation?.success && analyses.crack_segmentation.analysis) {
        const crackArea = analyses.crack_segmentation.analysis.total_crack_area || 0;
        const crackRiskScore = Math.min(100, crackArea * 15); // Scale crack area to risk score
        const crackConfidence = crackArea > 0 ? 85 : 95; // Higher confidence when cracks detected
        riskScores.push(crackRiskScore);
        confidenceScores.push(crackConfidence);
        
        const crackRiskLevel = crackRiskScore < 25 ? 'LOW' : 
                              crackRiskScore < 50 ? 'MEDIUM' : 
                              crackRiskScore < 75 ? 'HIGH' : 'CRITICAL';
        modelResults.push(`Cracks: ${crackRiskLevel}`);
      }

      // DEM Results - Convert slope to risk score
      if (analyses.dem?.success && analyses.dem.analysis) {
        // Check for the correct DEM analysis structure
        let maxSlope = 0;
        let riskScore = 0;
        
        if (analyses.dem.analysis.terrain_analysis?.slope_stats?.max) {
          // New structure: terrain_analysis.slope_stats.max
          maxSlope = analyses.dem.analysis.terrain_analysis.slope_stats.max;
        } else if (analyses.dem.analysis.risk_assessment?.max_slope) {
          // Alternative structure: risk_assessment.max_slope
          maxSlope = analyses.dem.analysis.risk_assessment.max_slope;
        } else if (analyses.dem.analysis.slope_statistics?.max_slope) {
          // Old structure: slope_statistics.max_slope
          maxSlope = analyses.dem.analysis.slope_statistics.max_slope;
        }
        
        // Use risk_score directly if available, otherwise calculate from slope
        if (analyses.dem.analysis.risk_assessment?.risk_score) {
          riskScore = analyses.dem.analysis.risk_assessment.risk_score;
        } else {
          riskScore = Math.min(100, maxSlope * 2.5); // Scale slope to risk score
        }
        
        const slopeConfidence = 90; // High confidence in DEM analysis
        riskScores.push(riskScore);
        confidenceScores.push(slopeConfidence);
        
        // Use risk level from DEM if available, otherwise calculate
        let slopeRiskLevel = 'LOW';
        if (analyses.dem.analysis.risk_assessment?.risk_level) {
          slopeRiskLevel = analyses.dem.analysis.risk_assessment.risk_level.toUpperCase();
        } else {
          slopeRiskLevel = riskScore < 25 ? 'LOW' : 
                          riskScore < 50 ? 'MEDIUM' : 
                          riskScore < 75 ? 'HIGH' : 'CRITICAL';
        }
        
        modelResults.push(`Geology: ${slopeRiskLevel}`);
      }

      // Calculate averages
      const averageRiskScore = riskScores.length > 0 ? 
        riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length : 0;
      
      const averageConfidence = confidenceScores.length > 0 ? 
        confidenceScores.reduce((sum, conf) => sum + conf, 0) / confidenceScores.length : 0;

      // Determine overall risk level from average score
      const overallRiskLevel = averageRiskScore < 25 ? 'Safe' : 
                              averageRiskScore < 50 ? 'Medium' : 
                              averageRiskScore < 75 ? 'High' : 'Critical';

      // Calculate risk probability/chances
      const riskChances = Math.min(100, averageRiskScore * 1.2);

      const finalResults = {
        overallRisk: overallRiskLevel,
        confidence: Math.round(averageConfidence),
        averageRiskScore: Math.round(averageRiskScore),
        riskChances: Math.round(riskChances),
        modelResults,
        contributingModels: riskScores.length,
        zones: [
          {
            id: 1,
            risk: overallRiskLevel,
            confidence: Math.round(averageConfidence),
            area: results.completeAnalysisData.location?.site_name || "Analysis Area",
            probability: Math.round(riskChances),
            lastUpdate: "Just now"
          }
        ]
      };

      // Debug logging
      console.log('📊 Final calculated results:', finalResults);
      console.log('🎯 Risk Scores:', riskScores);
      console.log('🔢 Confidence Scores:', confidenceScores);
      console.log(`📈 Models Contributing: ${riskScores.length} out of 3 possible models`);

      return finalResults;
    }

    // Fallback to original results structure if no comprehensive data
    return results;
  }, [results]);

  // Calculate additional forecast metrics


  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-900/30 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-900/30 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50';
      case 'safe': return 'text-green-400 bg-green-900/30 border-green-500/50';
      default: return 'text-slate-400 bg-slate-900/30 border-slate-500/50';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical': return <AlertTriangle className="h-5 w-5" />;
      case 'high': return <TrendingUp className="h-5 w-5" />;
      case 'medium': return <Clock className="h-5 w-5" />;
      case 'safe': return <CheckCircle className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getAlertMessage = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical':
        return {
          title: 'IMMEDIATE EVACUATION REQUIRED',
          description: 'Critical geological instability detected. All personnel must evacuate immediately.',
          action: 'Evacuate Now',
          priority: 'EMERGENCY'
        };
      case 'high':
        return {
          title: 'ENHANCED MONITORING NEEDED',
          description: 'Elevated risk conditions require increased surveillance and safety measures.',
          action: 'Increase Monitoring',
          priority: 'HIGH'
        };
      case 'medium':
        return {
          title: 'REGULAR ASSESSMENT RECOMMENDED',
          description: 'Moderate risk levels require standard monitoring protocols.',
          action: 'Continue Monitoring',
          priority: 'MEDIUM'
        };
      default:
        return {
          title: 'STABLE CONDITIONS',
          description: 'Geological conditions are within safe operational parameters.',
          action: 'Maintain Vigilance',
          priority: 'LOW'
        };
    }
  };



  return (
  <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      {/* Clean Top Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/falcon-logo.png" 
              alt="FALCON Logo" 
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-xl font-display font-bold text-white">Rockfall Forecast Results</h1>
              <p className="text-sm text-slate-400">AI Geological Analysis • Generated {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 px-3 py-2 bg-slate-700/50 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300 font-medium">Analysis Complete</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
        
        {/* Left Panel - Risk Assessment Details */}
        <div className="col-span-3 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex flex-col h-full space-y-4">
          
          {/* Risk Assessment Header */}
          <div className="mb-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <span>Risk Assessment</span>
            </h2>
            <p className="text-xs text-slate-400">Comprehensive geological analysis</p>
          </div>

          {/* Overall Risk Score */}
          <div className={`p-4 rounded-lg border-2 ${getRiskColor(combinedResults.overallRisk)} mb-3`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-shrink-0">
                {getRiskIcon(combinedResults.overallRisk)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{combinedResults.overallRisk.toUpperCase()} RISK</h3>
                <div className="text-sm text-slate-300">
                  <div className="mb-1">Risk Score: <span className="font-bold text-white">{combinedResults.averageRiskScore || 0}/100</span></div>
                  <div className="mb-1">Confidence: <span className="font-bold text-white">{combinedResults.confidence || 0}%</span></div>
                  <div>Risk Probability: <span className="font-bold text-white">{combinedResults.riskChances || 0}%</span></div>
                </div>
              </div>
            </div>
            <div className="bg-current/10 rounded-lg p-2">
              <span className="text-xs font-medium uppercase tracking-wide">{getAlertMessage(combinedResults.overallRisk).priority}</span>
            </div>
          </div>

          {/* Model Results Breakdown */}
          <div className="bg-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span>Model Analysis</span>
            </h4>
            <div className="space-y-2">
              <div className="text-xs text-slate-300">
                <div className="mb-1">Contributing Models: <span className="font-bold text-white">{combinedResults.contributingModels || 0}/3</span></div>
              </div>
              {combinedResults.modelResults && combinedResults.modelResults.length > 0 ? (
                combinedResults.modelResults.map((result: string, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-slate-600/40 rounded text-xs">
                    <span className="text-slate-300">{result.split(':')[0]}</span>
                    <span className="text-white font-bold">{result.split(':')[1] || 'N/A'}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">No model results available</div>
              )}
            </div>
          </div>        </div>

        {/* Central Map Area */}
        <div className="col-span-6 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden flex flex-col">
          
          {/* Map Header */}
          <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Navigation className="h-5 w-5 text-blue-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Geological Risk Visualization</h3>
                  <p className="text-sm text-slate-400">Interactive map showing predicted rockfall zones</p>
                </div>
              </div>
              {selectedZone && (
                <div className="bg-slate-700/70 rounded-lg px-3 py-2 border border-slate-600/50">
                  <p className="text-xs text-slate-400 font-medium">SELECTED ZONE</p>
                  <p className="font-bold text-white">{selectedZone.area}</p>
                  <p className="text-sm text-slate-300">{selectedZone.risk} Risk • {selectedZone.confidence}% Confidence</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 p-3">
            <div className="h-full bg-slate-900/40 backdrop-blur-sm border border-slate-700/40 rounded-lg overflow-hidden shadow-inner">
              <InteractiveMap 
                center={[24.35, 79.34]}
                selectedRisk={selectedZone}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Controls & Risk Zones */}
        <div className="col-span-3 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex flex-col space-y-4">
          
          {/* Risk Zones */}
          <div className="bg-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-400" />
              <span>Risk Zones ({(combinedResults.zones || results.zones).length})</span>
            </h4>
            <div className="space-y-1.5 overflow-y-auto pr-1 max-h-48">
              {(combinedResults.zones || results.zones).map((zone: any) => (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-2 rounded border cursor-pointer transition-all duration-200 hover:shadow-sm ${getRiskColor(zone.risk)} ${
                    selectedZone?.id === zone.id ? 'ring-1 ring-purple-400 shadow-sm' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1">
                      <div className="scale-75">{getRiskIcon(zone.risk)}</div>
                      <span className="font-bold text-xs">{zone.risk}</span>
                    </div>
                    <span className="text-xs font-bold">{zone.confidence}%</span>
                  </div>
                  <h5 className="font-medium text-xs mb-1 text-white truncate">{zone.area}</h5>
                  <div className="flex items-center justify-between text-xs">
                    <span className="opacity-80">Prob: {zone.probability}%</span>
                    <span className="opacity-70">{zone.lastUpdate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="bg-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Analysis Summary</span>
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-slate-600/40 rounded text-sm">
                <span className="text-slate-300">Overall Risk</span>
                <span className={`font-bold ${getRiskColor(combinedResults.overallRisk).split(' ')[0]}`}>
                  {combinedResults.overallRisk}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-600/40 rounded text-sm">
                <span className="text-slate-300">AI Confidence</span>
                <span className="text-white font-bold">{combinedResults.confidence}%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-600/40 rounded text-sm">
                <span className="text-slate-300">Risk Score</span>
                <span className="text-white font-bold">{combinedResults.averageRiskScore}/100</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-600/40 rounded text-sm">
                <span className="text-slate-300">Risk Zones</span>
                <span className="text-white font-bold">{(combinedResults.zones || results.zones).length} Identified</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-auto">
            <a
              href="https://safety-route-hd36-git-master-akshats-projects-92e467ae.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg no-underline"
            >
              <span>Show Optimized Route</span>
            </a>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onBack}
                className="py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                ← Back
              </button>
              <button
                onClick={onBackToDashboard}
                className="py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Dashboard
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default RockfallForecast;