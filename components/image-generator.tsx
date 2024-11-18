"use client"

import * as React from "react"
import { Check, ChevronDown, Edit, Upload, Clock, Shirt, Grid } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ImageGenerator() {
  const [selectedIcon, setSelectedIcon] = React.useState('edit')
  const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false)
  const [uploadType, setUploadType] = React.useState<'clothes' | 'model' | 'expand'>('clothes')
  const [clothesImageURL, setClothesImageURL] = React.useState("")
  const [modelImageURL, setModelImageURL] = React.useState("")
  const [expandImageURL, setExpandImageURL] = React.useState("")
  const [tempImageURL, setTempImageURL] = React.useState("")
  const [clothesType, setClothesType] = React.useState("top")
  const [imageDescription, setImageDescription] = React.useState("")
  const [style, setStyle] = React.useState("포토")
  const [ratio, setRatio] = React.useState("정사각형")
  const [generatedImageUrl, setGeneratedImageUrl] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const styles = [
    { value: "포토", label: "포토" },
    { value: "일러스트", label: "일러스트" },
    { value: "픽토그램", label: "픽토그램" },
  ]

  const ratios = [
    { value: "정사각형", label: "정사각형", icon: "□" },
    { value: "가로형", label: "가로형", icon: "▭" },
    { value: "세로형", label: "세로형", icon: "▯" },
  ]

  const handleUploadClick = (type: 'clothes' | 'model' | 'expand') => {
    setUploadType(type)
    setIsUploadDialogOpen(true)
  }

  const handleUploadConfirm = () => {
    if (uploadType === 'clothes') {
      setClothesImageURL(tempImageURL)
    } else if (uploadType === 'model') {
      setModelImageURL(tempImageURL)
    } else if (uploadType === 'expand') {
      setExpandImageURL(tempImageURL)
    }
    setTempImageURL("")
    setIsUploadDialogOpen(false)
  }

  const generateCreateImage = async () => {
    try {
      setIsGenerating(true);
      setErrorMessage(null);
      setGeneratedImageUrl("");
      
      const requestBody = {
        inputs: {
          style: style,
          ratio: ratio,
          desc: imageDescription,
        },
        query: imageDescription,
        response_mode: "blocking",
        user: "abc-123"
      };

      console.log('Create API 요청:', requestBody);

      const response = await fetch('https://api-mir.52g.ai/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer app-WLvajoOQ0v9FSicdAMuYAfhB',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('API 응답 상태:', response.status);

      const responseText = await response.text();
      console.log('API 응답 전문:', responseText);

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${responseText}`);
      }

      const data = JSON.parse(responseText);
      
      if (data.data?.error) {
        throw new Error(`API 에러: ${data.data.error}`);
      }

      if (data.data?.status === 'succeeded') {
        const imageUrl = data.data.outputs.result[0].url;
        if (imageUrl) {
          setGeneratedImageUrl(imageUrl);
          console.log('생성된 이미지 URL:', imageUrl);
        } else {
          throw new Error('이미지 URL을 찾을 수 없습니다.');
        }
      } else {
        throw new Error(`이미지 생성 실패: ${data.data?.status || '알 수 없는 상태'}`);
      }

    } catch (error) {
      console.error('이미지 생성 중 상세 오류:', error);
      setErrorMessage(error instanceof Error ? error.message : '이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateExpandImage = async () => {
    try {
      setIsGenerating(true);
      setErrorMessage(null);
      setGeneratedImageUrl("");
      
      const requestBody = {
        inputs: {
          image_url: {
            type: "image",
            transfer_method: "remote_url",
            url: expandImageURL
          },
          ratio: ratio
        },
        response_mode: "blocking",
        user: "abc-214"
      };

      console.log('Expand API 요청:', requestBody);

      const response = await fetch('https://mir-api.52g.ai/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer app-lqhALPmXPUkbyfVLQHvw1YFb',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('API 응답 상태:', response.status);

      const responseText = await response.text();
      console.log('API 응답 전문:', responseText);

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${responseText}`);
      }

      const data = JSON.parse(responseText);
      
      if (data.data?.error) {
        throw new Error(`API 에러: ${data.data.error}`);
      }

      if (data.data?.status === 'succeeded') {
        const imageUrl = data.data.outputs?.result?.[0]?.url || data.data.outputs?.image_url;
        if (imageUrl) {
          setGeneratedImageUrl(imageUrl);
          console.log('생성된 이미지 URL:', imageUrl);
        } else {
          throw new Error('이미지 URL을 찾을 수 없습니다.');
        }
      } else {
        throw new Error(`이미지 생성 실패: ${data.data?.status || '알 수 없는 상태'}`);
      }

    } catch (error) {
      console.error('이미지 확장 중 상세 오류:', error);
      setErrorMessage(error instanceof Error ? error.message : '이미지 확장 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = () => {
    if (selectedIcon === 'edit') {
      return (
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-lg font-medium flex items-center gap-2">
                💡 만들고 싶은 이미지를 설명해 주세요
              </label>
              <Textarea
                placeholder="크리스마스 트리와 선물꾸러미"
                className="min-h-[100px]"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium flex items-center gap-2">
                💡 스타일을 선택해 주세요
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {style}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                  {styles.map((item) => (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() => setStyle(item.value)}
                    >
                      {item.label}
                      {style === item.value && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium flex items-center gap-2">
                💡 이미지 비율을 선택해 주세요
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {ratio}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                  {ratios.map((item) => (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() => setRatio(item.value)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                      {ratio === item.value && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {errorMessage && (
              <div className="text-red-500 text-sm">
                {errorMessage}
              </div>
            )}
            <Button 
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              onClick={generateCreateImage}
              disabled={isGenerating}
            >
              {isGenerating ? '이미지 생성 중...' : '이미지 생성하기'}
            </Button>
            {generatedImageUrl && (
              <div className="w-full">
                <img 
                  src={generatedImageUrl} 
                  alt="Generated Image" 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            )}
          </CardFooter>
        </Card>
      )
    } else if (selectedIcon === 'grid') {
      return (
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-lg font-medium flex items-center gap-2">
                💡 배경을 확장하고 싶은 이미지를 업로드해 주세요
              </label>
              <Button 
                variant="outline" 
                className="w-full min-h-[200px] border-dashed relative overflow-hidden"
                onClick={() => handleUploadClick('expand')}
              >
                {expandImageURL ? (
                  <>
                    <img 
                      src={expandImageURL} 
                      alt="Preview" 
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="text-white flex flex-col items-center">
                        <Upload className="h-6 w-6 mb-2" />
                        이미지 변경하기
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-6 w-6 mb-2" />
                    이미지 업로드
                  </div>
                )}
              </Button>
              {expandImageURL && (
                <div className="mt-2 text-sm text-gray-500">
                  업로드된 이미지: {expandImageURL}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium flex items-center gap-2">
                💡 확장하고 싶은 이미지 비율을 선택해 주세요
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {ratio}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                  {ratios.map((item) => (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() => setRatio(item.value)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                      {ratio === item.value && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {errorMessage && (
              <div className="text-red-500 text-sm">
                {errorMessage}
              </div>
            )}
            <Button 
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              onClick={generateExpandImage}
              disabled={isGenerating || !expandImageURL}
            >
              {isGenerating ? '이미지 확장 중...' : '이미지 확장하기'}
            </Button>
            {generatedImageUrl && (
              <div className="w-full">
                <img 
                  src={generatedImageUrl} 
                  alt="Generated Image" 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            )}
          </CardFooter>
        </Card>
      )
    } else if (selectedIcon === 'shirt') {
      return (
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-lg font-medium flex items-center gap-2">
                💡 입히려는 옷 이미지를 업로드 해주세요
              </label>
              <Button 
                variant="outline" 
                className="w-full h-24 border-dashed"
                onClick={() => handleUploadClick('clothes')}
              >
                <Upload className="h-6 w-6 mr-2" />
                이미지 업로드
              </Button>
              {clothesImageURL && (
                <div className="mt-2 text-sm text-gray-500">
                  업로드된 이미지: {clothesImageURL}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium flex items-center gap-2">
                💡 옷 종류를 선택해주세요
              </label>
              <Select value={clothesType} onValueChange={setClothesType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="옷 종류 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="dress">Dress</SelectItem>
                  <SelectItem value="outer">Outer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium flex items-center gap-2">
                💡 모델 이미지를 업로드 해주세요
              </label>
              <Button 
                variant="outline" 
                className="w-full h-24 border-dashed"
                onClick={() => handleUploadClick('model')}
              >
                <Upload className="h-6 w-6 mr-2" />
                이미지 업로드
              </Button>
              {modelImageURL && (
                <div className="mt-2 text-sm text-gray-500">
                  업로드된 이미지: {modelImageURL}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {errorMessage && (
              <div className="text-red-500 text-sm">
                {errorMessage}
              </div>
            )}
            <Button 
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              onClick={generateCreateImage}
              disabled={isGenerating}
            >
              {isGenerating ? '이미지 생성 중...' : '이미지 생성하기'}
            </Button>
            {generatedImageUrl && (
              <div className="w-full">
                <img 
                  src={generatedImageUrl} 
                  alt="Generated Image" 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            )}
          </CardFooter>
        </Card>
      )
    }
    // Add other conditions for 'clock' icon if needed
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-black text-white">
        {/* GenSpark Title */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-bold font-inter">GenSpark</h1>
        </div>
        {/* Icon Bar */}
        <div className="h-20 w-full flex justify-start items-center px-4 space-x-8 border-t border-gray-700">
          <Button
            variant="link"
            className={`w-16 h-20 p-0 text-white hover:text-white ${selectedIcon === 'edit' ? 'font-bold' : ''} flex flex-col items-center justify-center`}
            onClick={() => setSelectedIcon('edit')}
            aria-label="Create"
          >
            <Edit className="h-6 w-6 mb-1" />
            <span className="text-xs">Create</span>
          </Button>
          <Button
            variant="link"
            className={`w-16 h-20 p-0 text-white hover:text-white ${selectedIcon === 'grid' ? 'font-bold' : ''} flex flex-col items-center justify-center`}
            onClick={() => setSelectedIcon('grid')}
            aria-label="Expand"
          >
            <Grid className="h-6 w-6 mb-1" />
            <span className="text-xs">Expand</span>
          </Button>
          <Button
            variant="link"
            className={`w-16 h-20 p-0 text-gray-500 hover:text-gray-500 cursor-not-allowed ${selectedIcon === 'clock' ? 'font-bold' : ''} flex flex-col items-center justify-center`}
            onClick={() => setSelectedIcon('clock')}
            aria-label="History"
            disabled={true}
          >
            <Clock className="h-6 w-6 mb-1" />
            <span className="text-xs">History</span>
          </Button>
          <Button
            variant="link"
            className={`w-16 h-20 p-0 text-white hover:text-white ${selectedIcon === 'shirt' ? 'font-bold' : ''} flex flex-col items-center justify-center`}
            onClick={() => setSelectedIcon('shirt')}
            aria-label="Dressing up"
          >
            <Shirt className="h-6 w-6 mb-1" />
            <span className="text-xs">Dressing up</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 pt-36 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Image Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이미지 URL 입력</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="https://example.com/image.jpg"
              value={tempImageURL}
              onChange={(e) => setTempImageURL(e.target.value)}
            />
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setTempImageURL("https://maestropasta.cz/wp-content/uploads/2024/06/compressed_img-i414YMRKS1ZYU8NFO81XezLN-1536x878.png")}
            >
              Sample Iamge 입력
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleUploadConfirm}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}