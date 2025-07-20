import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ProductImageDownloader = () => {
  const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false);
  const [logs, setLogs] = useState([]);
  const [processingOptions, setProcessingOptions] = useState({
    pricePosition: 'bottom-right',
    logoPosition: 'none',
    centerOnly: false
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [isGenerating9Grid, setIsGenerating9Grid] = useState(false);
  const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);
  const logoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const zipRef = useRef(null);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleLogoUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    if (!uploadedFile.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    setLogoFile(uploadedFile);
    
    const img = new Image();
    img.onload = () => {
      setLogoImage(img);
      addLog(`Logo上传成功: ${uploadedFile.name}`);
    };
    img.src = URL.createObjectURL(uploadedFile);
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.toLowerCase().endsWith('.xlsx')) {
      alert('请上传Excel文件(.xlsx格式)');
      return;
    }

    setFile(uploadedFile);
    setLogs([]);
    setProducts([]);
    setDownloadReady(false);
    addLog('文件上传成功');
    parseExcelFile(uploadedFile);
  };

  const parseExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        addLog(`解析Excel文件成功，共${jsonData.length}行数据`);

        const processedProducts = [];
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          let spu = row['商品spu'] || '';
          let price = row['商品售价*'] || '';
          const imageUrls = row['商品图片*'] || '';
          
          if (!price && i + 1 < jsonData.length) {
            price = jsonData[i + 1]['商品售价*'] || '';
            addLog(`SPU ${spu} 价格为空，使用下一行价格: ${price}`);
          }
          
          spu = String(spu).trim();
          price = String(price).trim();
          
          if (price && !isNaN(parseFloat(price))) {
            price = Math.floor(parseFloat(price)).toString();
          }
          
          const imageList = imageUrls.split(',').map(url => url.trim()).filter(url => url);
          const firstImageUrl = imageList[0] || '';

          if (spu && price && firstImageUrl) {
            processedProducts.push({
              id: processedProducts.length + 1,
              spu,
              price,
              imageUrls: imageList,
              firstImageUrl,
              filename: `${price}-${spu}.png`,
              status: 'pending'
            });
          }
        }

        setProducts(processedProducts);
        addLog(`找到${processedProducts.length}个有效产品数据`);
      } catch (error) {
        console.error('Excel解析错误:', error);
        addLog(`Excel解析失败: ${error.message}`);
        alert('Excel文件解析失败，请检查文件格式');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const generateSingleImages = async () => {
    if (products.length === 0) {
      alert('请先上传并解析Excel文件');
      return;
    }

    setIsGeneratingSingle(true);
    addLog('开始生成单图...');
    
    const zip = new JSZip();
    let successCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      try {
        addLog(`正在处理: ${product.spu}`);
        
        const img = new Image();
        // 移除crossOrigin设置
        
        const processedBlob = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('图片加载超时'));
          }, 10000);
          
          img.onload = async () => {
            clearTimeout(timeout);
            try {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              canvas.width = 800;
              canvas.height = 800;
              
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, 800, 800);
              
              const scale = Math.min(800 / img.width, 800 / img.height);
              const scaledWidth = img.width * scale;
              const scaledHeight = img.height * scale;
              
              const x = (800 - scaledWidth) / 2;
              const y = (800 - scaledHeight) / 2;
              
              ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
              
              // 添加价格标签
              if (processingOptions.pricePosition && processingOptions.pricePosition !== 'none') {
                const priceText = `MX$${product.price}`;
                const fontSize = 48;
                ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                
                const textMetrics = ctx.measureText(priceText);
                const textWidth = textMetrics.width;
                const textHeight = fontSize;
                
                const margin = 15;
                let xPos, yPos;
                
                switch (processingOptions.pricePosition) {
                  case 'top-left':
                    xPos = margin;
                    yPos = margin + textHeight;
                    break;
                  case 'top-right':
                    xPos = 800 - textWidth - margin;
                    yPos = margin + textHeight;
                    break;
                  case 'bottom-left':
                    xPos = margin;
                    yPos = 800 - margin;
                    break;
                  case 'bottom-right':
                    xPos = 800 - textWidth - margin;
                    yPos = 800 - margin;
                    break;
                }
                
                // 白色描边
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 4;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'bottom';
                ctx.strokeText(priceText, xPos, yPos);
                
                // 红色文字
                ctx.fillStyle = '#FF0000';
                ctx.fillText(priceText, xPos, yPos);
              }
              
              // 添加Logo
              if (processingOptions.logoPosition && processingOptions.logoPosition !== 'none' && logoImage) {
                const logoSize = 80;
                const margin = 15;
                
                let logoX, logoY;
                
                switch (processingOptions.logoPosition) {
                  case 'top-left':
                    logoX = margin;
                    logoY = margin;
                    break;
                  case 'top-right':
                    logoX = 800 - logoSize - margin;
                    logoY = margin;
                    break;
                  case 'bottom-left':
                    logoX = margin;
                    logoY = 800 - logoSize - margin;
                    break;
                  case 'bottom-right':
                    logoX = 800 - logoSize - margin;
                    logoY = 800 - logoSize - margin;
                    break;
                }
                
                ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
              }
              
              // 使用更兼容的方式创建blob
              try {
                // 使用更兼容的方式创建blob
            try {
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  // 如果toBlob失败，使用dataURL方法
                  const dataUrl = canvas.toDataURL('image/png', 0.9);
                  const byteString = atob(dataUrl.split(',')[1]);
                  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
                  const ab = new ArrayBuffer(byteString.length);
                  const ia = new Uint8Array(ab);
                  for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                  }
                  resolve(new Blob([ab], { type: mimeString }));
                }
              }, 'image/png', 0.9);
            } catch (error) {
              reject(error);
            }
              } catch (error) {
                reject(error);
              }
            } catch (error) {
              reject(error);
            }
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('图片加载失败'));
          };
          img.src = product.firstImageUrl;
        });
        
        const filename = `${product.price}-${product.spu}.png`;
        zip.file(filename, processedBlob);
        successCount++;
        addLog(`✓ 生成成功: ${filename}`);
        
      } catch (error) {
        addLog(`✗ 生成失败: ${product.spu} - ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    if (successCount > 0) {
      const content = await zip.generateAsync({ type: 'blob' });
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      saveAs(content, `single-images-${timestamp}.zip`);
      addLog(`✓ 单图生成完成！成功: ${successCount}`);
    }
    
    setIsGeneratingSingle(false);
  };

  const generate9GridImage = async () => {
    if (products.length < 9) {
      alert('需要至少9个产品才能生成9宫格图片');
      return;
    }

    setIsGenerating9Grid(true);
    setProgress(0);
    addLog('开始生成9宫格图片...');
    
    try {
      const totalGrids = Math.ceil(products.length / 9);
      addLog(`总计${products.length}个产品，将生成${totalGrids}张9宫格图片`);
      
      const zip = new JSZip();
      let successCount = 0;
      
      for (let batchIndex = 0; batchIndex < totalGrids; batchIndex++) {
        const startIdx = batchIndex * 9;
        const endIdx = Math.min(startIdx + 9, products.length);
        const gridProducts = products.slice(startIdx, endIdx);
        
        addLog(`正在生成第${batchIndex + 1}张9宫格图片 (产品${startIdx + 1}-${endIdx})`);
        
        try {
          addLog(`准备下载${gridProducts.length}张图片: ${gridProducts.map(p => p.spu).join(', ')}`);
          
          const imagePromises = gridProducts.map(async (product, index) => {
            try {
              addLog(`正在加载第${index + 1}张图片: ${product.spu}`);
              
              return new Promise((resolve, reject) => {
                const img = new Image();
                // 设置crossOrigin为anonymous，但有错误处理
                img.crossOrigin = 'anonymous';
                
                // 设置超时机制
                const timeout = setTimeout(() => {
                  addLog(`✗ 图片加载超时: ${product.spu}`);
                  // 超时时返回默认图片而不是拒绝
                  const defaultCanvas = document.createElement('canvas');
                  defaultCanvas.width = 400;
                  defaultCanvas.height = 400;
                  const defaultCtx = defaultCanvas.getContext('2d');
                  defaultCtx.fillStyle = '#F3F4F6';
                  defaultCtx.fillRect(0, 0, 400, 400);
                  defaultCtx.fillStyle = '#6B7280';
                  defaultCtx.font = '20px Arial';
                  defaultCtx.textAlign = 'center';
                  defaultCtx.fillText('图片加载失败', 200, 180);
                  defaultCtx.fillText(product.spu, 200, 220);
                  
                  const defaultImg = new Image();
                  defaultImg.onload = () => resolve({ product, img: defaultImg });
                  defaultImg.src = defaultCanvas.toDataURL();
                }, 8000); // 8秒超时
                
                img.onload = () => {
                  clearTimeout(timeout);
                  addLog(`✓ 图片加载成功: ${product.spu} (${img.width}x${img.height})`);
                  resolve({ product, img });
                };
                
                img.onerror = (error) => {
                  clearTimeout(timeout);
                  addLog(`✗ 图片加载失败，尝试无CORS模式: ${product.spu}`);
                  
                  // 如果CORS失败，尝试不使用CORS
                  const img2 = new Image();
                  
                  const timeout2 = setTimeout(() => {
                    addLog(`✗ 图片二次加载也失败: ${product.spu}`);
                    // 创建默认图片
                    const defaultCanvas = document.createElement('canvas');
                    defaultCanvas.width = 400;
                    defaultCanvas.height = 400;
                    const defaultCtx = defaultCanvas.getContext('2d');
                    defaultCtx.fillStyle = '#F3F4F6';
                    defaultCtx.fillRect(0, 0, 400, 400);
                    defaultCtx.fillStyle = '#6B7280';
                    defaultCtx.font = '20px Arial';
                    defaultCtx.textAlign = 'center';
                    defaultCtx.fillText('图片加载失败', 200, 180);
                    defaultCtx.fillText(product.spu, 200, 220);
                    
                    const defaultImg = new Image();
                    defaultImg.onload = () => resolve({ product, img: defaultImg });
                    defaultImg.src = defaultCanvas.toDataURL();
                  }, 5000);
                  
                  img2.onload = () => {
                    clearTimeout(timeout2);
                    addLog(`✓ 图片二次加载成功: ${product.spu}`);
                    resolve({ product, img: img2 });
                  };
                  
                  img2.onerror = () => {
                    clearTimeout(timeout2);
                    addLog(`✗ 图片二次加载失败: ${product.spu}`);
                    // 创建默认图片
                    const defaultCanvas = document.createElement('canvas');
                    defaultCanvas.width = 400;
                    defaultCanvas.height = 400;
                    const defaultCtx = defaultCanvas.getContext('2d');
                    defaultCtx.fillStyle = '#F3F4F6';
                    defaultCtx.fillRect(0, 0, 400, 400);
                    defaultCtx.fillStyle = '#6B7280';
                    defaultCtx.font = '20px Arial';
                    defaultCtx.textAlign = 'center';
                    defaultCtx.fillText('图片加载失败', 200, 180);
                    defaultCtx.fillText(product.spu, 200, 220);
                    
                    const defaultImg = new Image();
                    defaultImg.onload = () => resolve({ product, img: defaultImg });
                    defaultImg.src = defaultCanvas.toDataURL();
                  };
                  
                  // 不使用CORS再次尝试
                  img2.src = product.firstImageUrl;
                };
                
                // 首次尝试加载
                img.src = product.firstImageUrl;
              });
            } catch (error) {
              addLog(`✗ 图片处理失败: ${product.spu} - ${error.message}`);
              // 返回默认图片而不是抛出错误
              return new Promise((resolve) => {
                const defaultCanvas = document.createElement('canvas');
                defaultCanvas.width = 400;
                defaultCanvas.height = 400;
                const defaultCtx = defaultCanvas.getContext('2d');
                defaultCtx.fillStyle = '#F3F4F6';
                defaultCtx.fillRect(0, 0, 400, 400);
                defaultCtx.fillStyle = '#6B7280';
                defaultCtx.font = '20px Arial';
                defaultCtx.textAlign = 'center';
                defaultCtx.fillText('图片处理失败', 200, 180);
                defaultCtx.fillText(product.spu, 200, 220);
                
                const defaultImg = new Image();
                defaultImg.onload = () => resolve({ product, img: defaultImg });
                defaultImg.src = defaultCanvas.toDataURL();
              });
            }
          });
          
          addLog(`等待所有图片加载完成...`);
          // 使用Promise.allSettled确保所有Promise都完成，即使有些失败
          const imageResults = await Promise.allSettled(imagePromises);
          const loadedImages = imageResults
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
          
          addLog(`总共${gridProducts.length}张图片，成功加载${loadedImages.length}张图片，开始生成9宫格`);
          
          // 如果没有成功加载的图片，则跳过这个批次
          if (loadedImages.length === 0) {
            addLog(`✗ 第${batchIndex + 1}张9宫格图片：所有图片加载失败，跳过此批次`);
            continue;
          }
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 1200;
          canvas.height = 1200;
          
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 1200, 1200);
          
          const cellSize = 400;
          
          for (let i = 0; i < loadedImages.length; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = col * cellSize;
            const y = row * cellSize;
            
            const { product, img } = loadedImages[i];
            
            const scale = Math.min(cellSize / img.width, cellSize / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            
            const centerX = x + (cellSize - scaledWidth) / 2;
            const centerY = y + (cellSize - scaledHeight) / 2;
            
            ctx.drawImage(img, centerX, centerY, scaledWidth, scaledHeight);
            
            if (processingOptions.pricePosition && processingOptions.pricePosition !== 'none') {
              const priceText = `MX$${product.price}`;
              const fontSize = 32;
              ctx.font = `bold ${fontSize}px Arial, sans-serif`;
              
              const textMetrics = ctx.measureText(priceText);
              const textWidth = textMetrics.width;
              const textHeight = fontSize;
              
              const margin = 8;
              let xPos, yPos;
              
              switch (processingOptions.pricePosition) {
                case 'top-left':
                  xPos = x + margin;
                  yPos = y + margin + textHeight;
                  break;
                case 'top-right':
                  xPos = x + cellSize - textWidth - margin;
                  yPos = y + margin + textHeight;
                  break;
                case 'bottom-left':
                  xPos = x + margin;
                  yPos = y + cellSize - margin;
                  break;
                case 'bottom-right':
                  xPos = x + cellSize - textWidth - margin;
                  yPos = y + cellSize - margin;
                  break;
              }
              
              // 白色描边
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 3;
              ctx.textAlign = 'left';
              ctx.textBaseline = 'bottom';
              ctx.strokeText(priceText, xPos, yPos);
              
              // 红色文字
              ctx.fillStyle = '#FF0000';
              ctx.fillText(priceText, xPos, yPos);
            }
            
            if (processingOptions.logoPosition && processingOptions.logoPosition !== 'none' && logoImage) {
              const logoSize = 60;
              const margin = 10;
              
              let logoX, logoY;
              
              switch (processingOptions.logoPosition) {
                case 'top-left':
                  logoX = x + margin;
                  logoY = y + margin;
                  break;
                case 'top-right':
                  logoX = x + cellSize - logoSize - margin;
                  logoY = y + margin;
                  break;
                case 'bottom-left':
                  logoX = x + margin;
                  logoY = y + cellSize - logoSize - margin;
                  break;
                case 'bottom-right':
                  logoX = x + cellSize - logoSize - margin;
                  logoY = y + cellSize - logoSize - margin;
                  break;
              }
              
              ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
            }
            
            ctx.strokeStyle = '#E5E7EB';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cellSize, cellSize);
          }
          
          const blob = await new Promise((resolve) => {
            canvas.toBlob((blob) => {
              resolve(blob);
            }, 'image/png');
          });
          
          const spuList = gridProducts.map(p => p.spu).join(',');
          const filename = `grid_${batchIndex + 1}_${spuList}.png`;
          zip.file(filename, blob);
          
          successCount++;
          addLog(`✓ 第${batchIndex + 1}张9宫格图片生成成功`);
          
        } catch (error) {
          addLog(`✗ 第${batchIndex + 1}张9宫格图片生成失败: ${error.message}`);
        }
        
        const progressPercent = Math.round(((batchIndex + 1) / totalGrids) * 100);
        setProgress(progressPercent);
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      if (successCount > 0) {
        addLog('正在打包ZIP文件...');
        const content = await zip.generateAsync({ 
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: {
            level: 6
          }
        });
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        saveAs(content, `9grid-images-${timestamp}.zip`);
        addLog(`✓ 9宫格图片生成完成！共生成${successCount}张图片并打包下载`);
      }
      
    } catch (error) {
      addLog(`✗ 9宫格生成失败: ${error.message}`);
    } finally {
      setIsGenerating9Grid(false);
      setProgress(0);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <span className="text-green-500">✓</span>;
      case 'failed':
        return <span className="text-red-500">✗</span>;
      case 'downloading':
        return <span className="text-blue-500">⏳</span>;
      default:
        return <span className="text-gray-400">⏸</span>;
    }
  };

  const resetAll = () => {
    setFile(null);
    setProducts([]);
    setIsProcessing(false);
    setProgress(0);
    setDownloadReady(false);
    setLogs([]);
    setLogoFile(null);
    setLogoImage(null);
    zipRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
    
    addLog('系统已重置');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">产品图片批量下载</h2>
            <p className="text-gray-600">上传Excel文件，批量下载产品图片并打包</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">文件上传</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Excel文件</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  选择Excel文件
                </button>
                {file && (
                  <p className="text-sm text-gray-600 mt-2">
                    已选择: {file.name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo图片 (可选)</label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  选择Logo图片
                </button>
                {logoFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    已选择: {logoFile.name}
                  </p>
                )}
              </div>
            </div>

            {products.length > 0 && (
              <>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">处理选项</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">价格标签位置 (红色 MX$)</h4>
                      <div className="space-y-2">
                        {['none', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].map((position) => (
                          <label key={position} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="pricePosition"
                              value={position}
                              checked={processingOptions.pricePosition === position}
                              onChange={(e) => setProcessingOptions(prev => ({
                                ...prev,
                                pricePosition: e.target.value
                              }))}
                              className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">
                              {position === 'none' ? '不添加价格标签' : 
                               position === 'top-left' ? '左上角' :
                               position === 'top-right' ? '右上角' :
                               position === 'bottom-left' ? '左下角' : '右下角'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Logo位置 (60x60px)</h4>
                      <div className="space-y-2">
                        {['none', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].map((position) => (
                          <label key={position} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="logoPosition"
                              value={position}
                              checked={processingOptions.logoPosition === position}
                              onChange={(e) => setProcessingOptions(prev => ({
                                ...prev,
                                logoPosition: e.target.value
                              }))}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {position === 'none' ? '不添加Logo' : 
                               position === 'top-left' ? '左上角' :
                               position === 'top-right' ? '右上角' :
                               position === 'bottom-left' ? '左下角' : '右下角'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">数据统计</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>总产品数:</span>
                      <span className="font-medium">{products.length}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">图片生成选项</h4>
                    
                    <button
                      onClick={generateSingleImages}
                      disabled={isProcessing || isGenerating9Grid || isGeneratingSingle || products.length === 0}
                      className="w-full mb-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      {isGeneratingSingle ? '生成单图中...' : '生成单图 (价格-SPU.png)'}
                    </button>

                    <button
                      onClick={generate9GridImage}
                      disabled={isProcessing || isGenerating9Grid || isGeneratingSingle || products.length === 0}
                      className="w-full mb-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      {isGenerating9Grid ? '生成9宫格中...' : '生成9宫格图片'}
                    </button>
                  </div>

                  <button
                    onClick={resetAll}
                    disabled={isProcessing}
                    className="w-full bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    重置所有
                  </button>
                </div>

                {(isProcessing || isGenerating9Grid) && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {products.length > 0 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">产品列表</h3>
                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SPU</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">价格</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">文件名</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-center">
                            {getStatusIcon(product.status)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                            {product.spu}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {product.price}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {product.filename}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {logs.length > 0 && (
              <div className="border-t p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">操作日志</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-1 text-sm font-mono">
                    {logs.map((log, index) => (
                      <div 
                        key={index} 
                        className={`${
                          log.includes('✓') ? 'text-green-600' : 
                          log.includes('✗') ? 'text-red-600' : 
                          'text-gray-700'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {products.length === 0 && !file && (
              <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">上传Excel文件开始处理</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    支持.xlsx格式，需包含"商品spu"、"商品售价*"、"商品图片*"列
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageDownloader;