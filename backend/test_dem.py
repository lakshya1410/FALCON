#!/usr/bin/env python3
"""
Test script for DEM processor
"""

from dem_processor import get_dem_processor
import numpy as np
from PIL import Image

def test_dem_processor():
    """Test the DEM processor functionality"""
    try:
        # Get processor
        processor = get_dem_processor()
        print("✅ DEM Processor loaded successfully")
        print(f"📁 Model path: {processor.model_path}")
        print(f"🤖 Model loaded: {processor.model is not None}")
        
        # Create a test image (simulate elevation data)
        # Create a simple elevation pattern with some slopes
        elevation_data = np.zeros((100, 100), dtype=np.uint8)
        for i in range(100):
            for j in range(100):
                # Create a slope pattern
                elevation_data[i, j] = min(255, i + j)
        
        test_img = Image.fromarray(elevation_data)
        print("🖼️ Created test elevation image")
        
        # Process the image
        print("🔄 Processing DEM image...")
        result = processor.process_dem_image(test_img)
        
        # Check results
        if result["success"]:
            print("✅ DEM Analysis completed successfully!")
            print(f"🎯 Risk Level: {result['risk_assessment']['risk_level']}")
            print(f"📊 Risk Score: {result['risk_assessment']['risk_score']}")
            print(f"🔢 Confidence: {result['risk_assessment']['confidence']}")
            
            terrain_stats = result['terrain_analysis']
            print(f"📈 Elevation Range: {terrain_stats['elevation_stats']['min']}-{terrain_stats['elevation_stats']['max']}")
            print(f"📐 Max Slope: {terrain_stats['slope_stats']['max']}°")
            
        else:
            print(f"❌ DEM Analysis failed: {result.get('error', 'Unknown error')}")
            
    except Exception as e:
        print(f"💥 Error testing DEM processor: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_dem_processor()